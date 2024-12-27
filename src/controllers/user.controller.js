import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import { Op } from 'sequelize'; // Import Sequelize operators

const generateAccessAndRefreshToken = async (userId) => {
    try {
      // Find the user by primary key using Sequelize
      const user = await User.findOne({ where: { id: userId } });
  
      if (!user) {
        apiError(res, 404, false, "User not found");
        return;
      }
  
      // Generate access and refresh tokens using methods from the model
      const accessToken = user.generateAccessToken(); 
      const refreshToken = user.generateRefreshToken(); 
  
      // Update user with the refresh token
      user.refreshToken = refreshToken;
  
      // Save the user with the new refresh token
      await user.save({ validateBeforeSave: false });
  
      return { accessToken, refreshToken };
    } catch (error) {
      apiError(res, 500, false, "Something went wrong while generating refresh and access token");
      return;
    }
  };
 

  const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;
    const missingFields = [];
  
    if (!fullName) missingFields.push("full name");
    if (!email) missingFields.push("email");
    else if (!(email.includes("@gmail.com") || email.includes("@outlook.com") || email.includes("@yahoo.com"))) missingFields.push("use valid extension");
    if (!username) missingFields.push("username");
    if (!password) missingFields.push("password");
  
    if (missingFields.length > 0) {
      const error = `The following fields are required: ${missingFields.join(", ")}`;
      apiError(res, 400, false, error);
      return;
    }
  
    try {
      const existedUser = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }]  // Correct query syntax with Op.or
        }
      });
  
      if (existedUser) {
        apiError(res, 409, false, "User with email or username already exists");
        return;
      }
  
      const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase(),
      });
  
      // Return the newly created user without password
      const createdUser = user.toJSON();  // Serialize to JSON, omitting password
      delete createdUser.password;  // Optionally omit sensitive fields like password
      return res.status(201).json(new apiResponse(200, createdUser, "User registered Successfully"));
  
    } catch (error) {
      console.error("Error in registration:", error);
      apiError(res, 500, false, "Something went wrong while registering the user");
    }
  });
  
  export {registerUser};