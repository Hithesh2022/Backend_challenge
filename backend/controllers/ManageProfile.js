import User from "../models/Usermodel.js";
import jwt from "jsonwebtoken";
export const GetProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        console.log(user)
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
export const ChangeName = async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
  
        const userId = decoded._id;
  
        try {
          // Retrieve the user from the database using the user ID
          const user = await User.findById(userId);
  
          if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
          }
  
          const newName = req.body.name;
  
          // Update the user's name
          user.name = newName;
  
          // Save the updated user
          await user.save();
  
          return res.status(200).json({ message: 'Name updated successfully' });
        } catch (err) {
          console.log(err);
          return res.status(500).json({ error: 'Failed to update Name' });
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  export const changeEmail = async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
  
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
  
        const userId = decoded._id;
  
        try {
          // Retrieve the user from the database using the user ID
          const user = await User.findById(userId);
  
          if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
          }
  
          // Update the user's email
          user.email = req.body.email;
  
          // Save the updated user
          await user.save();
  
          return res.status(200).json({ message: 'Email updated successfully' });
        } catch (err) {
          console.log(err);
          return res.status(500).json({ error: 'Failed to update email' });
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Server error' });
    }
  };
export const UploadPhoto = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, { photo: req.body.photo });
        console.log(user)
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};