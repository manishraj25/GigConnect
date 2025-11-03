import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

// Routers
import authRouter from './routes/authRoutes.js';
import clientRouter from './routes/clientRoutes.js';
import freelancerRouter from './routes/freelancerRoutes.js';
import gigsRouter from './routes/gigsRoutes.js';
import searchRouter from './routes/searchRoutes.js';
import projectRouter from './routes/projectRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';

// Models
import Message from './models/Message.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB(process.env.MONGO_URI);

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

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
app.use('/api/projects', projectRouter);
app.use("/api/messages", messageRouter);
app.use('/api/payments',paymentRouter)

//Create HTTP server for Socket.IO
const server = http.createServer(app);

//Initialize Socket.IO
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
});

//Store online users
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`🟢 ${userId} joined`);
  });

  //Handle new message
  socket.on("sendMessage", async ({ from, to, content }) => {
    try {
      const newMessage = await Message.create({ from, to, content });
      const populatedMsg = await newMessage.populate([
        { path: "from", select: "name profileImage" },
        { path: "to", select: "name profileImage" },
      ]);

      const receiverSocketId = onlineUsers.get(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", populatedMsg);
      }
      io.to(socket.id).emit("messageSent", populatedMsg);
    } catch (error) {
      console.error("Socket sendMessage error:", error);
    }
  });

  //Mark messages as read live
  socket.on("markRead", async ({ from, to }) => {
    try {
      await Message.updateMany({ from, to, read: false }, { $set: { read: true } });

      const fromSocketId = onlineUsers.get(from);
      const toSocketId = onlineUsers.get(to);
      if (fromSocketId) io.to(fromSocketId).emit("messageRead", { from, to });
      if (toSocketId) io.to(toSocketId).emit("messageRead", { from, to });
    } catch (error) {
      console.error("Socket markRead error:", error);
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(userId);
        console.log(`🔴 ${userId} disconnected`);
        break;
      }
    }
  });
});

//Listen with the HTTP server (not app)
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
