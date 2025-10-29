import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import clientRouter from './routes/clientRoutes.js';
import freelancerRouter from './routes/freelancerRoutes.js';
import gigsRouter from './routes/gigsRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import searchRouter from './routes/searchRoutes.js';

const app = express();

// Connect to MongoDB
connectDB(process.env.MONGO_URI);

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: "http://localhost:5173", credentials: true}))

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/clients', clientRouter);
app.use('/api/freelancers', freelancerRouter);
app.use('/api/gigs', gigsRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/search', searchRouter);



const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
