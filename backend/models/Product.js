import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    product_name: String,
    product_url: String,
    current_price: Number,
    target_price: Number,
    price_history: [
      {
        price: Number,
        checked_at: Date,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);