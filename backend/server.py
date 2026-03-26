from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import resend
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24 * 7  # 7 days

# Resend Configuration
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')

# Security
security = HTTPBearer()

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Models
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    name: str
    email: str
    created_at: str

class PriceHistory(BaseModel):
    price: float
    checked_at: str

class ProductCreate(BaseModel):
    product_name: str
    product_url: str
    current_price: float
    target_price: float

class ProductUpdate(BaseModel):
    product_name: Optional[str] = None
    current_price: Optional[float] = None
    target_price: Optional[float] = None

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    product_id: str
    user_id: str
    product_name: str
    product_url: str
    current_price: float
    target_price: float
    last_checked: str
    price_history: List[PriceHistory]
    created_at: str

# Helper Functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, email: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = credentials.credentials
    payload = decode_token(token)
    user = await db.users.find_one({"user_id": payload["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

async def send_price_drop_email(user_email: str, product_name: str, current_price: float, target_price: float):
    """Send price drop notification email"""
    if not resend.api_key:
        logger.warning("RESEND_API_KEY not configured, skipping email")
        return
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; background-color: #02040a; color: #f8fafc; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: #09090b; border: 1px solid #1e293b; border-radius: 12px; padding: 30px; }}
            .header {{ text-align: center; margin-bottom: 30px; }}
            .header h1 {{ color: #6d28d9; margin: 0; font-size: 28px; }}
            .price-box {{ background: linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103); padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }}
            .price {{ font-size: 36px; color: #10b981; font-weight: bold; margin: 10px 0; }}
            .product-name {{ font-size: 20px; color: #f8fafc; margin-bottom: 15px; }}
            .target {{ color: #94a3b8; font-size: 14px; }}
            .button {{ display: inline-block; background-color: #6d28d9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; font-weight: bold; }}
            .footer {{ text-align: center; color: #94a3b8; font-size: 12px; margin-top: 30px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Price Drop Alert!</h1>
            </div>
            <p style="color: #94a3b8; font-size: 16px;">Great news! The price has dropped on a product you're tracking:</p>
            <div class="price-box">
                <div class="product-name">{product_name}</div>
                <div class="price">₹{current_price:,.2f}</div>
                <div class="target">Your target: ₹{target_price:,.2f}</div>
            </div>
            <p style="text-align: center; color: #10b981; font-size: 18px; font-weight: bold;">Price is now below your target!</p>
            <div style="text-align: center;">
                <a href="{os.environ.get('FRONTEND_URL', 'http://localhost:3000')}/dashboard" class="button">View Product</a>
            </div>
            <div class="footer">
                <p>You're receiving this because you're tracking this product on Price Drop Watcher.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    params = {
        "from": SENDER_EMAIL,
        "to": [user_email],
        "subject": f"Price Drop Alert: {product_name}",
        "html": html_content
    }
    
    try:
        await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Price drop email sent to {user_email} for {product_name}")
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")

# Background job to check prices
async def check_prices():
    """Check all products and send alerts if price dropped below target"""
    logger.info("Running price check job...")
    
    try:
        products = await db.products.find({}, {"_id": 0}).to_list(1000)
        
        for product in products:
            if product['current_price'] <= product['target_price']:
                # Get user email
                user = await db.users.find_one({"user_id": product['user_id']}, {"_id": 0})
                if user:
                    # Check if we already sent notification (by checking last_checked time)
                    last_checked = datetime.fromisoformat(product['last_checked'])
                    now = datetime.now(timezone.utc)
                    hours_since_check = (now - last_checked).total_seconds() / 3600
                    
                    # Send email only if it's been more than 24 hours since last check
                    # to avoid spam (or if it's first time checking)
                    if hours_since_check > 24 or len(product['price_history']) <= 1:
                        await send_price_drop_email(
                            user['email'],
                            product['product_name'],
                            product['current_price'],
                            product['target_price']
                        )
        
        logger.info(f"Price check completed. Checked {len(products)} products.")
    except Exception as e:
        logger.error(f"Error in price check job: {str(e)}")

# Auth Routes
@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    import uuid
    user_id = str(uuid.uuid4())
    user_doc = {
        "user_id": user_id,
        "name": user_data.name,
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    
    # Create token
    token = create_token(user_id, user_data.email)
    
    return {
        "token": token,
        "user": {
            "user_id": user_id,
            "name": user_data.name,
            "email": user_data.email
        }
    }

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    # Find user
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not verify_password(credentials.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create token
    token = create_token(user['user_id'], user['email'])
    
    return {
        "token": token,
        "user": {
            "user_id": user['user_id'],
            "name": user['name'],
            "email": user['email']
        }
    }

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "user_id": current_user['user_id'],
        "name": current_user['name'],
        "email": current_user['email']
    }

# Product Routes
@api_router.post("/products", response_model=Product)
async def create_product(product_data: ProductCreate, current_user: dict = Depends(get_current_user)):
    import uuid
    
    now = datetime.now(timezone.utc).isoformat()
    product_id = str(uuid.uuid4())
    
    initial_history = PriceHistory(
        price=product_data.current_price,
        checked_at=now
    )
    
    product_doc = {
        "product_id": product_id,
        "user_id": current_user['user_id'],
        "product_name": product_data.product_name,
        "product_url": product_data.product_url,
        "current_price": product_data.current_price,
        "target_price": product_data.target_price,
        "last_checked": now,
        "price_history": [initial_history.model_dump()],
        "created_at": now
    }
    
    await db.products.insert_one(product_doc)
    
    return Product(**product_doc)

@api_router.get("/products", response_model=List[Product])
async def get_products(current_user: dict = Depends(get_current_user)):
    products = await db.products.find({"user_id": current_user['user_id']}, {"_id": 0}).to_list(1000)
    return [Product(**p) for p in products]

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str, current_user: dict = Depends(get_current_user)):
    product = await db.products.find_one({"product_id": product_id, "user_id": current_user['user_id']}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**product)

@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product_data: ProductUpdate, current_user: dict = Depends(get_current_user)):
    product = await db.products.find_one({"product_id": product_id, "user_id": current_user['user_id']}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_fields = {}
    if product_data.product_name is not None:
        update_fields["product_name"] = product_data.product_name
    if product_data.target_price is not None:
        update_fields["target_price"] = product_data.target_price
    
    # If current price is updated, add to history
    if product_data.current_price is not None and product_data.current_price != product['current_price']:
        update_fields["current_price"] = product_data.current_price
        update_fields["last_checked"] = datetime.now(timezone.utc).isoformat()
        
        new_history = PriceHistory(
            price=product_data.current_price,
            checked_at=update_fields["last_checked"]
        )
        
        await db.products.update_one(
            {"product_id": product_id},
            {"$push": {"price_history": new_history.model_dump()}}
        )
    
    if update_fields:
        await db.products.update_one(
            {"product_id": product_id},
            {"$set": update_fields}
        )
    
    updated_product = await db.products.find_one({"product_id": product_id}, {"_id": 0})
    return Product(**updated_product)

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.products.delete_one({"product_id": product_id, "user_id": current_user['user_id']})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize scheduler
scheduler = AsyncIOScheduler()

@app.on_event("startup")
async def startup_event():
    # Run price check every 6 hours
    scheduler.add_job(check_prices, 'interval', hours=6)
    scheduler.start()
    logger.info("Price check scheduler started")

@app.on_event("shutdown")
async def shutdown_event():
    scheduler.shutdown()
    client.close()