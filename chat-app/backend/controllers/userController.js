import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/UserModel.js";
import { createToken } from "../utils/createToken.js";
import { socket } from "../../frontend/src/socket/socket.js";

export const login = async (req, res) => {
  try {
    // get user credentails
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter all the credentials",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }
    // verify password
    const verifyPassword = await bcrypt.compare(password, user?.password);
    if (!verifyPassword) {
      return res.status(400).json({
        message: "Incorrect Password",
        success: false,
      });
    }
    createToken(res, user?._id);
    socket.emit('setup',user?._id)
    return res.status(200).json(user);
  } catch (error) {
    console.error(`Error in login : ${error}`);
  }
};

export const register = async (req, res) => {
  try {
    // get user details
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    // console.log(user);
    if (user) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please Enter all the credentials",
        success: false,
      });
    }
    // hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // save into db
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // create a token
    createToken(res, newUser._id);
    // send res
    return res.status(201).json(newUser);
  } catch (error) {
    console.error(`error Registering User: ${error}`);
  }
};

export const logout = (req, res) => {
  try {
    // empty the cookie
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    socket.emit('logout',req.user?._id)
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error(`Error Logging out: ${error}`);
  }
};

export const getUserProfile = async (req, res) => {
  try {
    // get user id
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found to get profile",
        success: false,
      });
    } else {
      return res.status(200).json(user);
    }
  } catch (error) {
    console.error(`Failed to get User profile ${error}`);
  }
};
export const editUserProfile = async (req, res) => {
  try {
    // get user Id
    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }
    const user = await User.findById(userId);
    // get User details
    const { name, email, description, profileImage } = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, {
      name,
      email,
      description,
      profileImage,
    });
    await updatedUser.save();
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      newProfile: updatedUser,
    });
  } catch (error) {
    console.log(`Error editing profile: ${error}`);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    console.error(`Error getting all users: ${error}`);
  }
};

// export const updateUserStatus = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { status } = req.body;
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "User not found for status updation",
//       });
//     }
//     await User.findByIdAndUpdate(
//       {
//         _id: userId,
//       },
//       { $set: { status } }
//     );

//     // get io  and emit event
//     const io = req.app.get("io")
//     if(io){
//       io.to(userId).emit('user-status',status);
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Status updated successfully",
//       status: user?.status
//     })
//   } catch (error) {
//     console.error(`Error updating status: ${error}`);
//   }
// };
