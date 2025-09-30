
import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';

import cors from 'cors';
import bodyParser from 'body-parser';

import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/db.js';
import messageRoutes from './routes/messages.js';
import groupRoutes from './routes/groups.js';
import summarizeRoute from './routes/summarize.js'; 
import { socketHandler } from './sockets/messageHandler.js';

const app = express();
const server = http.createServer(app);

const io = new SocketIO(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(bodyParser.json());

connectDB();
socketHandler(io);

//Routes
app.use('/messages', messageRoutes);
app.use('/groups', groupRoutes);
app.use('/summarize', summarizeRoute);


server.listen(3000, () => console.log('server is running on http//localhost:3000'));
