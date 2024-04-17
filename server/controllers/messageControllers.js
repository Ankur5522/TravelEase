import Message from '../models/messagesModel.js';
import Group from '../models/groupModel.js';
import { getGroupSocketId, io } from '../socket.js';

// Create a new message
export const createMessage = async (req, res) => {
  try {
    const { groupId, userId, messageContent } = req.body;

    console.log(groupId)

    const group = await Group.findById(groupId)
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const message = new Message({
      sender: userId,
      content: messageContent,
    });

    group.messages.push(message._id);
    
    await Promise.all([message.save(), group.save()]);

    io.to(groupId).emit('message', message);

    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get messages for a specific chat room
export const getMessages = async (req, res) => {
  const { groupId } = req.params;
    try {
      const group = await Group.findById(groupId).populate('messages');
      if(!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
      res.status(200).json(group.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  