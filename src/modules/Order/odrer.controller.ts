import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { addMealToOrderSchema, createOrderSchema, deleteMealFromOrderSchema, getAllOrdersSchema } from "./order.validation";
import { orderService } from "./order.service";
import { params } from "../../utils/general";

const createOrder = async (req: AuthRequest, res: Response) => {
    const waiterId = req?.user?.userId as string;
    const { orderItems, tableNumber } = createOrderSchema.parse(req.body);

    const order = await orderService.createOrder({ orderItems, tableNumber, waiterId });
    
    res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order
    });
}

const addMealToOrder = async (req: AuthRequest, res: Response) => {
    const { id: orderId } = params.parse(req.params);
    const { mealId, quantity } = addMealToOrderSchema.parse(req.body);

    const order = await orderService.addMealToOrder({ orderId, orderItem: { mealId, quantity } });
    
    res.status(200).json({
        success: true,
        message: 'Meal added to order successfully',
        data: order
    });
}

const deleteMealFromOrder = async (req: AuthRequest, res: Response) => {
    const { id: orderId } = params.parse(req.params);
    const { mealId } = deleteMealFromOrderSchema.parse(req.body);

    const order = await orderService.deleteMealFromOrder({ orderId, mealId });

    res.status(200).json({
        success: true,
        message: 'Meal deleted from order successfully',
        data: order
    });
}

const getAllOrders = async (req: AuthRequest, res: Response) => {
    const userId = req?.user?.userId as string;
    const { page, size, date, waiterId, status } = getAllOrdersSchema.parse(req.body);

    const order = await orderService.getAllOrders({ page, size, date, waiterId, status });
    
    res.status(201).json({
        success: true,
        message: 'تم إنشاء الطلب بنجاح',
        data: order
    });
}

export const orderCtrl = {
    createOrder,
    addMealToOrder,
    deleteMealFromOrder,
    getAllOrders
}


