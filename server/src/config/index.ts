import mongoose from 'mongoose';
import dotenv from 'dotenv';
const uri =
    'mongodb+srv://admin:t5fUEiyxf6UbY2MN@cluster0.tnl6qbx.mongodb.net/mern-learning?retryWrites=true&w=majority&appName=Cluster0';
const uriCompass = 'mongodb://localhost:27017/AHAuth';

export async function connect() {
    try {
        await mongoose.connect(uriCompass);
        console.log('Successfully connect');
    } catch (err) {
        console.log(err);
    }
}
