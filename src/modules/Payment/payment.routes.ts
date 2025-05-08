import { Router } from "express";
import { UserRoles } from "../users/users.interface";
import { isAuthunticated } from "../../middleware/auth.middleware";
import { paymentCtrl } from "./payment.controller";
import asyncHandler from "express-async-handler";

const router = Router();

router
    .route('/')
    .post( 
        isAuthunticated([UserRoles.CASHIER]),
        asyncHandler(paymentCtrl.createPayment)
    )
    .get(
        isAuthunticated([UserRoles.MANAGER]),
        asyncHandler(paymentCtrl.getAllPayments)
    );

router
    .route('/:id')
    .get(
        isAuthunticated([UserRoles.MANAGER]),
        asyncHandler(paymentCtrl.getPaymentById)
    );
export const paymentRouter = router;