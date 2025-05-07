import { Router } from "express";
import { orderCtrl } from "./odrer.controller";
import { isAuthunticated } from "../../middleware/auth.middleware";
import asyncHandler from 'express-async-handler'
import { UserRoles } from "../users/users.interface";

const router = Router();

router.route('/')
    .post(
        isAuthunticated([UserRoles.WAITER]),
        asyncHandler(orderCtrl.createOrder)
    )
    .get(
        isAuthunticated(),
        asyncHandler(orderCtrl.getAllOrders)
    )

router.route('/:id')
    .patch(
        isAuthunticated([UserRoles.WAITER]),
        asyncHandler(orderCtrl.addMealToOrder)
    )
    .delete(
        isAuthunticated([UserRoles.MANAGER]),
        asyncHandler(orderCtrl.deleteMealFromOrder)
    )

export const ordrRouter = router;


