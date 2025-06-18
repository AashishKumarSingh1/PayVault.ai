import express from 'express';
import dotenv from 'dotenv';
import billRoute from "./src/routes/billRoute"
import transactionRoute from "./src/routes/transactionRoute"
import {connectDb} from "./src/utils/connectDb"
import cors from "cors"
import paymentRoute from "./src/routes/paymentRoute";
import Razorpay from 'razorpay';
import crypto from 'crypto';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || '';
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,   
  key_secret: process.env.RAZORPAY_SECRET!, 
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from TypeScript + Express + MongoDB!');
});

app.use("/bills",billRoute);
app.use("/transactions",transactionRoute);
app.use("/payments",paymentRoute)

app.listen(PORT,async ()=>{
  await connectDb();
  console.log(`Server is running on port ${PORT}`);
})
