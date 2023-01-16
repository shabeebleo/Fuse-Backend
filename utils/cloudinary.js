// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
import {v2 as cloudinary} from 'cloudinary'
// const cloudinary = require("cloudinary").v2;
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

// module.exports = { cloudinary };
export default cloudinary
