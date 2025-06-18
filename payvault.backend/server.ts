import express from 'express';
import dotenv from 'dotenv';
import billRoute from "./src/routes/billRoute"
import transactionRoute from "./src/routes/transactionRoute"
import {connectDb} from "./src/utils/connectDb"
import cors from "cors"
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || '';
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from TypeScript + Express + MongoDB!');
});

app.use("/bills",billRoute);
app.use("/transactions",transactionRoute);

app.listen(PORT,async ()=>{
  await connectDb();
  console.log(`Server is running on port ${PORT}`);
})
