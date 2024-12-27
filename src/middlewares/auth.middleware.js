import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"; // Assuming Sequelize model
import { apiError } from "../utils/apiError.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // for the access of all the cookies
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      apiError(res, 401, false, "Unauthorized request");
      return;
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Replace the MongoDB query with a Sequelize query
    const user = await User.findOne({
      where: { id: decodedToken?.id }, // Assuming '_id' corresponds to the 'id' column in the Sequelize model
      attributes: { exclude: ['password', 'refreshToken'] }
    });

    if (!user) {
      apiError(res, 401, false, "Invalid access token");
      return;
    }

    // Set the user object on the request
    req.user = user;
    next();

  } catch (error) {
    apiError(res, 401, false, error?.message || "Invalid access token");
    return;
  }
});
