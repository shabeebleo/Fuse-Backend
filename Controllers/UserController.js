import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import cloudinary from "../utils/cloudinary.js";
//get a user

export const getUser = async (req, res) => {
  const id = req.userId;
  try {
    const user = await UserModel.findById(id).select("-password");

    if (user) {
      const userDetails = user._doc;

      res.status(200).json(userDetails);
    } else {
      res.status(404).json("user does't exist");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//get any user
export const getAnyUser = async (req, res) => {
  const id = req.params.id;
  console.log(id,"user id in getAny user")
  try {
    const user = await UserModel.findById(id).select("-password");

    if (user) {
      const userDetails = user._doc;

      res.status(200).json(userDetails);
    } else {
      res.status(404).json("user does't exist");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
// get profile data

export const profileData = async (req, res) => {
  const id = req.body;
  try {
    const user = await UserModel.findById(id).select("-password");

    if (user) {
      const userDetails = user._doc;

      res.status(200).json(userDetails);
    } else {
      res.status(404).json("user does't exist");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
//get all users

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await UserModel.find().select("-password");
    // console.log(allUsers, "allUSersssss");
    if (allUsers) {
      //       const userDetails = allUsers._doc;
      // console.log(userDetails,"userDetailsss............")
      res.status(200).json(allUsers);
    } else {
      res.status(404).json("user does't exist");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
//get all followers

export const getFollowers = async (req, res) => {
  const userId=req.params.id?req.params.id:req.userId
  
  try {
    console.log("get followers");
    const allFollowers = await UserModel.findOne({_id:userId}).populate("followers");
   
    if (allFollowers) {
      //       const userDetails = allUsers._doc;
      // console.log(userDetails,"userDetailsss............")
      res.status(200).json(allFollowers.followers);
    } else {
      res.status(404).json("user does't exist");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
//get all followings

export const getFollowings = async (req, res) => {
  const userId=req.params.id?req.params.id:req.userId
  
  try {
    console.log("get followings");
    const allFollowings = await UserModel.findOne({_id:userId}).populate("following");
   console.log(allFollowings,"allFollowingsallFollowingsallFollowings")
    if (allFollowings) {
      //       const userDetails = allUsers._doc;
      // console.log(userDetails,"userDetailsss............")
      res.status(200).json(allFollowings.following);
    } else {
      res.status(404).json("user does't exist");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//password change user

export const passwordChange = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const { currentUserId, currentUserAdminStatus, password } = req.body;

  if (id === currentUserId || currentUserAdminStatus) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you can only update your account");
  }
};
//update user

export const updateUser = async (req, res) => {
  const userId = req.params.id;
  console.log(userId, "userID", req.userId, "req.userId");
  console.log(req.files, "req.file");
  if (!userId) {
    res.status(400);
    throw new Error("user not aquired");
  }
  if (userId != req.userId) {
    res.status(500);
    throw new Error("access denied");
  }
  console.log(req.body, "req.body....................89");

  let profilePic;
  if (req.files.profile) {
    profilePic = req.files.profile[0];
  }
  console.log(profilePic, "profilepic....");
  let coverPic;
  if (req.files.cover) {
    coverPic = req.files.cover[0];
  }
  console.log(coverPic, "coverPic....");
  try {
    console.log(" user update try  ethi");
  
    let resultCover
    if (coverPic) {
      resultCover = await cloudinary.uploader.upload(coverPic?.path);
      req.body.coverPicture = resultCover.secure_url;
      req.body.coverCloudinary_id = resultCover.public_id;
    }
    let resultProfile
    if(profilePic){
      resultProfile = await cloudinary.uploader.upload(profilePic?.path);
      req.body.profilePic = resultProfile.secure_url;
      req.body.coverCloudinary_id = resultProfile.public_id;
    }

    console.log(
      "cloudinary",
      resultProfile,
      "resultProfile",
      resultCover,
      "resultCover"
    );
    req.body.profilePicture = resultProfile.secure_url;
    req.body.profileCloudinary_id = resultProfile.public_id;

    const response = await UserModel.findByIdAndUpdate(req.userId, req.body);
    console.log(response, "response");
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

//delete user

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus } = req.body;
  if (currentUserId === id || currentUserAdminStatus) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("account deleted");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Accses denied! you can only delete your account");
  }
};

//follow user

export const followUnFollowUser = async (req, res) => {
  const id = req.params.id;
  console.log(id, "idid");
  const userId = req.userId;

  const currentUserId = userId;
  if (currentUserId == id) {
    res.status(403).json("action forbidden");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(currentUserId);
      if (!followUser.followers.includes(currentUserId)) {
        await followUser.updateOne({ $push: { followers: currentUserId } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json({message:"user followed",success:true});
      } else {
        await followUser.updateOne({ $pull: { followers: currentUserId } });
        await followingUser.updateOne({ $pull: { following: id } });
        res.status(200).json("user unfollowed");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};


//user Ssearch

export const getSearchUsers=async(req,res)=>{
  const query=req.params.id
  console.log(query,"queryyyyy")
  const searchedUsers=await UserModel.find({"firstname":{ '$regex' :query, '$options' : 'i' } }).limit(10)
  console.log(searchedUsers,"......searchedUsers")
  res.json(searchedUsers)
}
