// utils/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.db_atlas, {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
    }); 
    console.log(process.env.db_atlas);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  } 
};

export default connectDB;