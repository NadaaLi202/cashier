import express, { Application } from "express";
import globalErrorHandler from "./middleware/errors.middleware";
import ApiError from "./utils/apiErrors";
import userRouter from "./modules/User/users.route";
import authRouter from "./modules/Auth/auth.router";
import departmentRouter from "./modules/Department/department.route";
import mealsRouter from "./modules/Meal/meal.route";
import { UserRoles } from "./modules/User/users.interface";
import { ordrRouter } from "./modules/Order";
import { tableRoutes } from "./modules/Table";
import { paymentRouter } from "./modules/Payment";
import storeRouter from "./modules/Store/store.routes";

declare module "express" {

    interface Request {
        filterData ? : any ;
        files ? : any ;
        user ? : any ;
    }
}

declare global {
  namespace Express {
    export interface Request {
      user?: {
        userId: string;
        role: UserRoles;
      }
    }
  }
}

    
const Routes : (app : Application) => void = (app: express.Application) : void => {

    app.use('/api/v1/users',userRouter)
    app.use('/api/v1/auth',authRouter)
    app.use('/api/v1/departments',departmentRouter)
    app.use('/api/v1/meals',mealsRouter)
    app.use('/api/v1/order', ordrRouter)
    app.use('/api/v1/table', tableRoutes)
    app.use('/api/v1/payment', paymentRouter)
    app.use('/api/v1/stores',storeRouter)
    
    app.all('*', (req:express.Request, res:express.Response, next:express.NextFunction) => {  
        next(new ApiError(`Route ${req.originalUrl} not found`, 404));
    })
    app.use(globalErrorHandler);

}

export default Routes

