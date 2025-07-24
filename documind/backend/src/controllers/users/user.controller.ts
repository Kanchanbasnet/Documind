import { Request, Response } from "express";
import User from "../../models/users/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Details are required." });
    }
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    return res
      .status(201)
      .json({ message: "User created Successfully", token: token });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const {email, password } = req.body;
    const user = await User.findOne({email: email});
    if(!user){
        return res.status(404).json({message: 'User not Found.'})
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(400).json({message: 'Invalid Credentials.'});
    }
    const token = jwt.sign(
        {id: user._id}, process.env.JWT_SECRET as string,
        {expiresIn: '1h'}
    )
    return res.status(200).json({message: "User logged in Successfully.", token: token});
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }
   
    return res
      .status(200)
      .json({ message: "Users Fetched Successfully.", users: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not Found." });
    }
    return res
      .status(200)
      .json({ message: "User Fetched Successfully.", user: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    await User.findByIdAndDelete(id);
    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (password && password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }
    const salt = await bcrypt.genSalt(10);

    await User.findByIdAndUpdate(id, {
      name: name || user.name,
      email: email || user.email,
      password: password ? await bcrypt.hash(password, salt) : user.password,
    });
    return res
      .status(200)
      .json({ message: "User updated successfully."});
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
