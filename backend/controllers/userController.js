import axios from 'axios'
import { User } from '../models/user.js';
import bcrypt from 'bcrypt'

const getUser = async (request, response) => {
    try {
      const { userId } = request.params;
      const user = await User.findById(userId);
      
      if (!user) {
        return response.status(404).json({ error: 'User not found' });
      }
      
      response.json(user);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: 'Something went wrong' });
    }
  };

  const getUsers = async (request, response) => {

    try {
      const users = await User.find({});
      response.json(users);
    } catch (error) {
      // Handle the error
      response.status(500).json({ error: 'Something went wrong' });
    }
  }

  const deleteUser = async (request, response) => {
    try {
      const { userId } = request.params;
      const deletedUser = await User.findByIdAndDelete(userId);
      
      if (!deletedUser) {
        return response.status(404).json({ error: 'User not found' });
      }
      
      response.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: 'Something went wrong' });
    }
  };

  const createUser = async (request, response) => {
    try {
      const { username, name, email, profileimage, profileText, password } = request.body;
  
      console.log(password)
      if(!password) {
        return response.status(400).json({ error: `password is already exists` })
      }

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
  
      const user = new User({
        username,
        name,
        email,
        profileimage,
        profileText,
        passwordHash,
        favourites: []
      });
  
      const savedUser = await user.save();
  
      response.status(201).json(savedUser);
    } catch (error) {
      console.log(error)
      if (error.code === 11000) {
        // Duplicate value error (e.g., duplicate username or email)
        const duplicateField = Object.keys(error.keyPattern)[0];
        return response.status(400).json({ error: `${duplicateField} already exists` });
      } else if (error.name === 'ValidationError') {
        // Handle validation errors
        const validationErrors = Object.values(error.errors).map((err) => err.message);
        return response.status(400).json({ error: validationErrors });
      }
      response.status(500).json({ error: 'Something went wrong' });
    }
  }

  const updateUser = async (request, response) => {
    try {
      const { userId } = request.params; 
      const { username, password, profileText, profileImage, favourites } = request.body;
      console.log(userId)

      if (!username && !password && !profileText && !profileImage && !favourites) {
        return response.status(400).json({ error: 'something to modify must be provided' });
      }
  
      // Create an update object based on the provided fields
      const updateObject = {};
      if (username) {
        updateObject.username = username;
      }
      if (profileText) {
        updateObject.profileText = profileText;
      }
      if (profileImage) {
        updateObject.profileImage = profileImage;
      }
      if (favourites) {
        updateObject.$push = { favourites: favourites };
      }
      if (password) {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        updateObject.passwordHash = passwordHash;
      }
  
      // Find the user by ID and update the fields
      const updatedUser = await User.findByIdAndUpdate(userId, updateObject, { new: true, timeout: 20000 });

  
      if (!updatedUser) {
        return response.status(404).json({ error: 'User not found' });
      }
  
      response.json(updatedUser);
    } catch (error) {
        console.log(error)
        if (error.code === 11000) {
          // Duplicate value error (e.g., duplicate username or email)
          const duplicateField = Object.keys(error.keyPattern)[0];
          return response.status(400).json({ error: `${duplicateField} already exists` });
        } else if (error.name === 'ValidationError') {
          // Handle validation errors
          const validationErrors = Object.values(error.errors).map((err) => err.message);
          return response.status(400).json({ error: validationErrors });
        }
        response.status(500).json({ error: 'Something went wrong' });
      }
  };
  
   

export default {
    getUser, getUsers, createUser, updateUser, deleteUser
}