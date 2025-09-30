import mongoose from 'mongoose';
export const connectDB = async () => {
    try{
        mongoose.connect('mongodb://127.0.0.1:27017/chatapp')
            .then(() => console.log('MongoDB connected'));
       
    } catch(error){
         console.error('MongoDB connection error: ', err);
         process.exit(1);
    }
};