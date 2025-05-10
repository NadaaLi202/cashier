import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import usersSchema from "../User/users.schema";
import ApiError from "../../utils/apiErrors";
import bcrypt from "bcryptjs";
import sanitization from "../../utils/sanitization";
import jwt from "jsonwebtoken";

class AuthService {
  signup = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await usersSchema.create({
        username: req.body.username,
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        image: req.body.image,
        role: req.body.role,
      });

      const token = jwt.sign(
        { _id: user._id, role: user.role },
        process.env.JWT_SECRET!
      );
      res
        .status(201)
        .json({
          message: "User created successfully",
          token,
          data: sanitization.User(user),
        });
    }
  );

  login = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await usersSchema.findOne({
        $or: [{ username: req.body.username }, { email: req.body.email }],
      });

      if (
        !user ||
        user.hasPassword === false ||
        !(await bcrypt.compare(req.body.password, user.password))
      ) {
        return next(
          new ApiError(`${req.__("validation_email_password")}`, 400)
        );
      }

      const token = jwt.sign(
        { _id: user._id, role: user.role },
        process.env.JWT_SECRET!
      );
      res
        .status(200)
        .json({
          message: "User logged in successfully",
          token,
          data: sanitization.User(user),
        });
    }
  );


  protectedRoutes = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['token'] as string | undefined;
    console.log("Token from Headers:", token); // Log the token received

    // Check if token is provided
    if (!token) {
        return next(new ApiError('please provide a token', 401));
    }

    try {
        // Verify the token
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        console.log("Decoded Token:", decoded); // Inspect the token payload

        const userId = decoded.userId || decoded._id
        console.log("User ID from Token:", userId); // Verify the ID being used in the query

        // Find user by ID
        const user = await usersSchema.findById(userId);
        console.log("User from Database:", user); // Check if a user is found

        // Check if user exists
        if (!user) {
            return next(new ApiError('user not found or deleted', 404));
        }

        // Check if the password has been changed
        if (user.passwordChangedAt instanceof Date) {
            const changePasswordTime = Math.trunc(user.passwordChangedAt.getTime() / 1000);
            if (changePasswordTime > decoded.iat) {
                return next(new ApiError(`${req.__('check_password_changed')}`, 401));
            }
        }

        req.user = user;
        next();

    } catch (error: any) {
        console.error("Error in protectedRoutes:", error); // Log any errors during verification or database lookup
        return next(new ApiError('Invalid token', 401)); // Or a more specific error message if possible
    }
});


  allowedTo =
    (...roles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
      if (!roles.includes(req.user.role))
        return next(new ApiError(`${req.__("allowed_to")}`, 403));
      next();
    };
}

//   checkActive = expressAsyncHandler(
//     async (req: Request, res: Response, next: NextFunction) => {
//       if (!req.user.active)
//         return next(new ApiError(`${req.__("check_active")}`, 403));
//       next();
//     }
//   );


const authService = new AuthService();
export default authService;