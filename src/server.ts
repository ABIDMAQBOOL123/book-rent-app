import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import bookRoutes from './routes/bookRoutes';
import transactionRoutes from './routes/transactionRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


connectDB();


app.use(cors());
app.use(bodyParser.json());


app.use('/api', userRoutes);
app.use('/api', bookRoutes);
app.use('/api', transactionRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
