import { Router } from "express";
import { UserRoles } from "../users/users.interface";
import { isAuthunticated } from "../../middleware/auth.middleware";
import { paymentCtrl } from "./payment.controller";

const router = Router();

router
    .route('/')
    .post( 
        isAuthunticated([UserRoles.CASHIER]),
        paymentCtrl.createPayment
    )
    .get(
        isAuthunticated([UserRoles.MANAGER]),
        paymentCtrl.getAllPayments
    );

router
    .route('/:paymentId')
    .get(
        isAuthunticated([UserRoles.MANAGER]),
        paymentCtrl.getPaymentById
    );
export const paymentRouter = router;