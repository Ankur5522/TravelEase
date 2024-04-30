import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: 'exp://192.168.103.55:8081' } });

const activeConnections = new Map();

export const getGroupSocketId = (groupId) => {
	return userSocketMap[groupId];
};

io.on('connection', (socket) => {
    if (!activeConnections.has(socket.id)) {
        socket.on('joinChat', ({ groupId }) => {
            socket.join(groupId);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);

            const connectionInfo = activeConnections.get(socket.id);
            if (connectionInfo) {
                const { userId, chatId } = connectionInfo;
                io.to(chatId).emit('userDisconnected', userId);
                activeConnections.delete(socket.id);
            }
        });
    } else {
        console.log('User reconnected:', socket.id);
    }
});

export { app, io, server };