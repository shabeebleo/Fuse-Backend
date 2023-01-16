import UserModel from "../Models/userModel.js";
import bcrypt, { genSalt, hash } from 'bcrypt';
import jwt from "jsonwebtoken";

// import asyncHandler from "express-async-handler"


//registering a new user

export const  registerUser = async (req, res) => {
  const { username, password, firstname, lastname, email } = req.body;
  console.log(req.body,"register req mon")
  if(!username || !password || !firstname || !lastname|| !email){
    res.status(400)
    throw new Error("please add all fields")
  }
  //check user exists
  const userExists= await UserModel.findOne({email})
  if (userExists){
    res.status(400)
   res.json("userExists")
  }
const salt= await genSalt(10)
const hashpass=await hash(password,salt)

  const newUser = new UserModel({ username, password:hashpass, firstname, lastname ,email});

  try {
    await newUser.save();
    res.status(200).json({newUser,message:"user registered",success:true,token:generateToken(newUser._id)});
  } catch (error) {
    res.status(500).json({ message: error.message});
  }
};

//login user 

export const loginUser= async(req,res)=>{
  const{username,password}=req.body
try {
  const user=await UserModel.findOne({username:username})

if(user&&(user.isBlocked==false)){
  const valid=await bcrypt.compare(password,user.password)

  valid?res.status(200).json({user,success:true,token:generateToken(user._id)}):res.status(400).json({message:"wrong password"})
}else{
  res.status(404).json( {message: "user not found"})
}
} catch (error) {
  res.status(500).json({ message: error.message });
}

}
//generate token
const generateToken=(id)=>{
return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'30d'})
}