import { Router } from "express";
import { orderCtrl } from "./odrer.controller";
import { isAuthenticated } from "../../middleware/auth.middleware";
import asyncHandler from 'express-async-handler'
import { UserRoles } from "../User/users.interface";

const router = Router();

router.route('/')
    .post(
        isAuthenticated([UserRoles.WAITER]),
        asyncHandler(orderCtrl.createOrder)
    )
    .get(
        isAuthenticated([
            UserRoles.WAITER, 
            UserRoles.MANAGER, 
            UserRoles.CASHIER,
            UserRoles.ACCOUNTANT
        ]),
        asyncHandler(orderCtrl.getAllOrders)
    )

router.route('/:id')
    .patch(
        isAuthenticated([UserRoles.WAITER]),
        asyncHandler(orderCtrl.addMealToOrder)
    )
    .delete(
        isAuthenticated([UserRoles.MANAGER]),
        asyncHandler(orderCtrl.deleteMealFromOrder)
    ).get(
        isAuthenticated([UserRoles.WAITER, UserRoles.CASHIER, UserRoles.MANAGER, UserRoles.ACCOUNTANT]),
        asyncHandler(orderCtrl.getOrderById)
    )

router.patch(
    '/:id/change-table',
    isAuthenticated([UserRoles.WAITER]),
    asyncHandler(orderCtrl.changeTable)
)

router.patch(
    '/:id/complete',
    // isAuthenticated([UserRoles.CASHIER]),
    asyncHandler(orderCtrl.completeOrder)
)

router.patch(
    '/:id/cancel',
    isAuthenticated([UserRoles.MANAGER]),
    asyncHandler(orderCtrl.cancelOrder)
)

router.get(
    '/get-by-code/:orderCode',
    isAuthenticated([
        UserRoles.WAITER,
        UserRoles.MANAGER,
        UserRoles.CASHIER,
        UserRoles.ACCOUNTANT
    ]),
    asyncHandler(orderCtrl.getOrderByCode)
)


router.get(
    '/get-by-table/:tableNumber',
    isAuthenticated([
        UserRoles.WAITER,
        UserRoles.MANAGER,
        UserRoles.CASHIER,
        UserRoles.ACCOUNTANT
    ]),
    asyncHandler(orderCtrl.getOrderByTable)
)

export const orderRouter = router;


