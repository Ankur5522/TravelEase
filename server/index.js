import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import "dotenv/config";
import userRoutes from './routes/userRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import {app,server} from './socket.js';

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGO_URI;

mongoose.connect(MONGODB_URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Routes
app.get('/', (req, res) => {
    res.send('Server is running');
});
app.use('/user', userRoutes);
app.use('/group', groupRoutes);
app.use('/message',messageRoutes);

// Start the server
const PORT = process.env.PORT || 3070;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
