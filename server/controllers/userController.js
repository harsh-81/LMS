import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import {User} from "../models/userModel.js";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from "cloudinary";

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find({accountVerified: true});
    res.status(200).json({
        success: true,
        users,
    });
});

export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
    // Check for avatar file
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Admin avatar is required.", 400));
    }

    // Check if req.body exists and has required fields
    if (!req.body || !req.body.name || !req.body.email || !req.body.password) {
        return next(new ErrorHandler("Please fill all fields.", 400));
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const isRegistered = await User.findOne({ email, accountVerified: true });
    if (isRegistered) {
        return next(new ErrorHandler("User already registered", 400));
    }

    // Password length check
    if (password.length < 8 || password.length > 16) {
        return next(
            new ErrorHandler("Password must be between 8 to 16 characters long.", 400)
        );
    }

    // Validate file type
    const { avatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(avatar.mimetype)) {
        return next(new ErrorHandler("File format not supported.", 400));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        { folder: "LIBRARY_MANAGEMENT_SYSTEM_ADMIN_AVATARS" }
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
            "cloudinary error:",
            cloudinaryResponse.error || "Unknown cloudinary error."
        );
        return next(
            new ErrorHandler("Failed to upload avatar image to cloudinary.", 500)
        );
    }

    // Create new admin
    const admin = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "Admin",
        accountVerified: true,
        avatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });

    res.status(201).json({
        success: true,
        message: "Admin registered successfully.",
        admin,
    });
});


// export const registerNewAdmin = catchAsyncErrors(async(req, res, next)=>{
//     if(!req.files || Object.keys(req.files).length === 0) {
//         return next(new ErrorHandler("Admin avatar is required.", 400));
//     }
//     const {name, email, password} = req.body;
//     if(!name || !email || !password){
//         return next(new ErrorHandler("Please fill all fields.", 400));
//     }
//     const isRegistered = await User.findOne({email, accountVerified: true});
//     if(isRegistered){
//         return next(new ErrorHandler("User already registered", 400));
//     }
//     if(password.length < 8 || password.length > 16){
//         return next(
//             new ErrorHandler("Password must be between 8 to 16 characters long.", 400)
//         );
//     }
//     const {avatar} = req.files;
//     const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
//     if(!allowedFormats.includes(avatar.mimetype)){
//         return next(new ErrorHandler("File format not supported.", 400));
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const cloudinaryResponse = await cloudinary.uploader.upload(
//         avatar.tempFilePath, {
//             folder: "LIBRARY_MANAGEMENT_SYSTEM_ADMIN_AVATARS",
//         }
//     );
//     if(!cloudinaryResponse || cloudinaryResponse.error){
//         console.error(
//             "cloudinary error:",
//             cloudinaryResponse.error || "Unknown cloudinary error."
//         );
//         return next(new ErrorHandler("Failed to upload avatar image to cloudinary.", 500));
//     }
//     const admin = await User.create({
//         name,
//         email,
//         password: hashedPassword,
//         role: "Admin",
//         accountVerified: true,
//         avatar: {
//             public_id: cloudinaryResponse.public_id,
//             url: cloudinaryResponse.secure_url,
//         },
//     });
//     res.status(201).json({
//         success: true,
//         message: "Admin registered successfully.",
//         admin,
//     });
// });

// import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
// import ErrorHandler from "../middlewares/errorMiddlewares.js";
// import { User } from "../models/userModel.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { v2 as cloudinary } from "cloudinary";

// export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
//   const users = await User.find({ accountVerified: true });
//   res.status(200).json({
//     success: true,
//     users,
//   });
// });

// export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return next(new ErrorHandler("Admin avatar is required.", 400));
//   }

//   const { name, email, password } = req.body;
//   if (!name || !email || !password) {
//     return next(new ErrorHandler("Please fill all fields.", 400));
//   }

//   const isRegistered = await User.findOne({ email, accountVerified: true });
//   if (isRegistered) {
//     return next(new ErrorHandler("User already registered", 400));
//   }

//   if (password.length < 8 || password.length > 16) {
//     return next(
//       new ErrorHandler("Password must be between 8 to 16 characters long.", 400)
//     );
//   }

//   const { avatar } = req.files;
//   const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
//   if (!allowedFormats.includes(avatar.mimetype)) {
//     return next(new ErrorHandler("File format not supported.", 400));
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const cloudinaryResponse = await cloudinary.uploader.upload(
//     avatar.tempFilePath,
//     {
//       folder: "LIBRARY_MANAGEMENT_SYSTEM_ADMIN_AVATARS",
//     }
//   );

//   if (!cloudinaryResponse || cloudinaryResponse.error) {
//     console.error(
//       "cloudinary error:",
//       cloudinaryResponse.error || "Unknown cloudinary error."
//     );
//     return next(
//       new ErrorHandler("Failed to upload avatar image to cloudinary.", 500)
//     );
//   }

//   const admin = await User.create({
//     name,
//     email,
//     password: hashedPassword,
//     role: "Admin",
//     accountVerified: true,
//     avatar: {
//       public_id: cloudinaryResponse.public_id,
//       url: cloudinaryResponse.secure_url,
//     },
//   });

//   // 🆕 Set the JWT token as a cookie
//   const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY, {
//     expiresIn: "7d",
//   });

//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: false, // set to true in production with HTTPS
//     sameSite: "Lax",
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//   });

//   res.status(201).json({
//     success: true,
//     message: "Admin registered successfully.",
//     admin,
//   });
// });
