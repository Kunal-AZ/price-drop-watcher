import nodemailer from 'nodemailer';

export const sendAlert = async (email, product) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Price Drop Alert',
    text: `${product.product_name} dropped to ₹${product.current_price}`,
  });
};