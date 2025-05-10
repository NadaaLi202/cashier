import { NextFunction, Request, Response } from 'express';
import { UserRoles } from '../modules/User/users.interface';
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/apiErrors';
import { verify } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: UserRoles;
  };
}

export interface IJwtPayload {
    userId: string;
    role: UserRoles;
}

export const isAuthunticated = (allowedRoles: UserRoles[] = []) => {
    return asyncHandler(
        async (req: AuthRequest, _res: Response, next: NextFunction) => {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return next(new ApiError('Unauthorized - No Prefix Token', 401));
            }

            const token = authHeader.split(' ')[1];

            if (!token) {
                return next(new ApiError('Unauthorized - No Token', 401));
            }

            const { role, userId} = verify(token, process.env.JWT_SECRET as string) as IJwtPayload;

            if (allowedRoles && !allowedRoles.includes(role)) {
                return next(new ApiError('Unauthorized - Not have access to this', 401));
            }

            req.user = { userId, role };          
            
            return next();
        },
    );
}