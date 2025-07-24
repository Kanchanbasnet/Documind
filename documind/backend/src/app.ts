import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/mongodb.connection';
import userRoutes from './routes/users/user.routes';


const app = express();
connectDB();

app.use(express.json());
app.use('/api/users', userRoutes);



export default app;
