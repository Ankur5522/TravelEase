import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' }}); 

const activeConnections = new Map();

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    socket.on('sendMessage', (message) => {                  // Handle new messages
      io.to(message.ChatRoomId).emit('newMessage', message);
    });
  
    
    socket.on('joinChat', ({ ChatRoomId, user_Id }) => {          // Handle user joining a chat room
      socket.join(ChatRoomId);
      activeConnections.set(socket.id, { user_Id, ChatRoomId });
      console.log(`User ${user_Id} joined chat room: ${ChatRoomId}`);
    });
  

    socket.on('disconnect', () => {                         // Handle user disconnect
      console.log('User disconnected:', socket.id);
  
      const connectionInfo = activeConnections.get(socket.id);
      if (connectionInfo) {
        const { userId, chatId } = connectionInfo;
        io.to(chatId).emit('userDisconnected', userId);
        activeConnections.delete(socket.id);
      }
    });
  });
  
export {app,server};
