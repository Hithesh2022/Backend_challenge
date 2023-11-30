import User from "../models/Usermodel.js";
import Post,{Comment} from "../models/Postmodel.js";

import jwt from "jsonwebtoken";

 export const UploadPost = async (req, res) => {
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
                        return res.status(401).json({ message: 'usernot exist' });
                    }
                    const newPost = req.body.message;
                    // Update the user's name
                    const post = new Post();
                    post.user=userId;
                   post.message = newPost;
                    // Save the updated user
                    await post.save();
                    return res.status(200).json({ message: 'Post updated successfully' });
                } catch (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'Failed to update Post' });
                }
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
    
    export const GetPost = async (req, res) => {
        try {
            const posts = await Post.find()
            .populate({
              path: 'user',
              select: '-password -phonenumber', // Exclude password and phoneNumber
            })
            .populate({
              path: 'comments.user',
              select: '-password -phonenumber', // Exclude password and phoneNumber
            });
          // Use populate to replace user and comments.user with actual user details
      
          const formattedPosts = posts.map(post => ({
            postId: post._id,
            user: post.user,
            message: post.message,
            photo: post.photo,
            comments: post.comments.map(comment => ({
              user: comment.user,
              message: comment.message,
            })),
          }));
      
          res.status(200).json(formattedPosts);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Server error" });
        }
      };


      export const CommentPost = async (req, res) => {
        const postId = req.params._id;
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
                return res.status(401).json({ message: 'User not found' });
              }
      
               // Access the post ID from query parameters
      
              // Assuming you have a Post model with the name "Post"
              const post = await Post.findById(postId);
      
              if (!post) {
                return res.status(404).json({ message: 'Post not found' });
              }
      
              const newCommentMessage = req.body.message;
      
              // Assuming you have a Comment model with the name "Comment"
              const newComment = new Comment({
                user: userId,
                message: newCommentMessage,
              });
      
              // Save the new comment to the database
              await newComment.save();
      
              // Add the new comment to the post's comments array
              post.comments.push(newComment);
      
              // Save the updated post
              await post.save();
      
              return res.status(200).json({ message: 'Comment added successfully' });
            } catch (err) {
              console.error(err);
              return res.status(500).json({ error: 'Failed to add comment' });
            }
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Server error' });
        }
      };
      