import mongoose from 'mongoose';

let connectionPromise;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME || 'dropify',
    }).catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }

  const connection = await connectionPromise;
  console.log(
    `MongoDB connected: ${connection.connection.host}/${connection.connection.name}`
  );
  return mongoose.connection;
};

export default connectDB;
