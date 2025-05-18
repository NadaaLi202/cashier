import express, { Application } from "express";
import globalErrorHandler from "./middleware/errors.middleware";
import ApiError from "./utils/apiErrors";
import userRouter from "./modules/User/users.route";
import authRouter from "./modules/Auth/auth.router";
import kitchenRouter from "./modules/kitchen/kitchen.route";
import mealsRouter from "./modules/Meal/meal.route";
import { UserRoles } from "./modules/User/users.interface";
import { orderRouter } from "./modules/Order";
import { tableRoutes } from "./modules/Table";
import { paymentRouter } from "./modules/Payment";
import stockRouter from "./modules/Stock/stock.routes";


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
    app.use('/api/v1/kitchens',kitchenRouter)
    app.use('/api/v1/meals',mealsRouter)
    app.use('/api/v1/order', orderRouter)
    app.use('/api/v1/table', tableRoutes)
    app.use('/api/v1/payment', paymentRouter)
    app.use('/api/v1/stock', stockRouter)
    
    app.all('*', (req:express.Request, res:express.Response, next:express.NextFunction) => {  
        next(new ApiError(`Route ${req.originalUrl} not found`, 404));
    })
    app.use(globalErrorHandler);

}

export default Routes

