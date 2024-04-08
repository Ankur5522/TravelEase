import bcrypt from 'bcrypt';
import User from '../models/userModel.js';

export const loginUser = async (req, res) => {
    const { phoneNumber, password } = req.body;
    try {
      const user = await User.findOne({ phoneNumber });
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(400).json({ error: 'Invalid password' });
      }
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

export const checkUser = async (req, res) => {
    const { phoneNumber } = req.body;
  
    try {
      const existingUser = await User.findOne({ phoneNumber });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      res.status(200).json({ message: 'User does not exist' });
    } catch (error) {
      console.error('Check user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

export const signupUser = async (req, res) => {
    const { name, phoneNumber, password} = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        name,
        phoneNumber,
        password: hashedPassword
      });
  
      await newUser.save();
      res.status(201).json({ message: 'Signup successful', user: newUser });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({error: 'Internal server error' });
    }
  }