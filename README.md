# 🛍️ BargainIt – Price Drop Watcher

BargainIt is a smart and automated price tracking web application built using the MERN stack. It helps users monitor product prices in real-time and notifies them when prices drop, enabling smarter and more cost-effective shopping decisions.

---

## 🚀 Features
- 📉 Real-time price tracking of products
- 🔔 Automated price drop alerts
- 🌐 Supports multiple product URLs
- ⚡ Fast and responsive user interface
- 🧠 Smart monitoring using backend scheduling
- 🔐 Secure data handling with MongoDB

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- HTML5, CSS3, JavaScript

**Backend:**
- Node.js
- Express.js

**Database:**
- MongoDB

**Other Tools:**
- Axios (API requests)
- Cron Jobs / Scheduler (for periodic tracking)

---

## 📌 How It Works

1. User enters a product URL through the frontend
2. The backend stores product details in the database
3. A scheduler periodically checks the product price
4. If a price drop is detected → user gets notified

---

## 🎯 Use Cases

- 🛒 Track discounts on e-commerce products
- ⚡ Monitor flash sales automatically
- 💰 Save money by buying at the right time

---

## ▶️ How to Run Locally

```bash
# Clone the repository
git clone https://github.com/Kunal-AZ/price-drop-watcher.git

# Go to project folder
cd price-drop-watcher

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# Run backend
npm start

# Run frontend
cd ../client
npm start
