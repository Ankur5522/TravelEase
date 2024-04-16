import Message from '../models/messagesModel.js';
import ChatRoom from '../models/chatRoomModel.js';
import mongoose from 'mongoose';

// Create a new message
export const createMessage = async (req, res) => {
  try {
    const { chatId, senderId, text } = req.body;

    const chatRoom = await ChatRoom.findById(chatId);
    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    // Create a new message
    const message = new Message({
      sender: senderId,
      content: text,
    });
    await message.save();

    // Update the chat room with the new message
    chatRoom.messages.push(message._id);
    await chatRoom.save();

    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get messages for a specific chat room
export const getMessages = async (req, res) => {
    try {
      const { chatId } = req.params;

      const chatRoom = await ChatRoom.findById(chatId);
  
      if (!chatRoom) {
        return res.status(404).json({ message: 'Chat room not found' });
      }
  
      const messages = await Message.find({ _id: { $in: chatRoom.messages } });
  
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  