import { Router } from "express";
import { orderCtrl } from "./odrer.controller";
import { isAuthunticated } from "../../middleware/auth.middleware";
import asyncHandler from 'express-async-handler'
import { UserRoles } from "../User/users.interface";

const router = Router();

router.route('/')
    .post(
        isAuthunticated([UserRoles.WAITER]),
        asyncHandler(orderCtrl.createOrder)
    )
    .get(
        isAuthunticated([
            UserRoles.WAITER, 
            UserRoles.MANAGER, 
            UserRoles.CASHIER,
            UserRoles.ACCOUNTANT
        ]),
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
    ).get(
        isAuthunticated([UserRoles.WAITER, UserRoles.CASHIER, UserRoles.MANAGER, UserRoles.ACCOUNTANT]),
        asyncHandler(orderCtrl.getOrderById)
    )

router.patch(
    '/:id/change-table',
    isAuthunticated([UserRoles.WAITER]),
    asyncHandler(orderCtrl.changeTable)
)

router.patch(
    '/:id/complete',
    isAuthunticated([UserRoles.CASHIER]),
    asyncHandler(orderCtrl.completeOrder)
)

router.patch(
    '/:id/cancel',
    isAuthunticated([UserRoles.MANAGER]),
    asyncHandler(orderCtrl.cancelOrder)
)

router.get(
    '/get-by-code/:orderCode',
    isAuthunticated([
        UserRoles.WAITER,
        UserRoles.MANAGER,
        UserRoles.CASHIER,
        UserRoles.ACCOUNTANT
    ]),
    asyncHandler(orderCtrl.getOrderByCode)
)

router.get(
    '/get-by-table/:tableNumber',
    isAuthunticated([
        UserRoles.WAITER,
        UserRoles.MANAGER,
        UserRoles.CASHIER,
        UserRoles.ACCOUNTANT
    ]),
    asyncHandler(orderCtrl.getOrderByTable)
)

export const ordrRouter = router;


