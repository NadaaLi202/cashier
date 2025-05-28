import { AuthRequest } from "../../middleware/auth.middleware";
import {
  addMealToOrderSchema,
  changeTableSchema,
  createOrderSchema,
  deleteMealFromOrderSchema,
  getAllOrdersSchema,
  getOrderByCodeSchema,
  getOrderByTableSchema
} from "./order.validation";
import { orderService } from "./order.service";
import { params } from "../../utils/general";
import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import ApiError from "../../utils/apiErrors";

const createOrder = async (req: AuthRequest, res: Response) => {
  const waiterId = req?.user?.userId as string;
  const { orderItems, tableNumber, type, isPaid } = createOrderSchema.parse(req.body);

  const order = await orderService.createOrder({ orderItems, type, tableNumber, waiterId , isPaid });

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order
  });
};

const addMealToOrder = async (req: AuthRequest, res: Response) => {
  const { id: orderId } = params.parse(req.params);
  const { mealId, quantity } = addMealToOrderSchema.parse(req.body);

  const order = await orderService.addMealToOrder({ orderId, orderItem: { mealId, quantity } });

  res.status(200).json({
    success: true,
    message: 'Meal added to order successfully',
    data: order
  });
};

const deleteMealFromOrder = async (req: AuthRequest, res: Response) => {
  const { id: orderId } = params.parse(req.params);
  const { mealId } = deleteMealFromOrderSchema.parse(req.body);

  const order = await orderService.deleteMealFromOrder({ orderId, mealId });

  res.status(200).json({
    success: true,
    message: 'Meal deleted from order successfully',
    data: order
  });
};

const getAllOrders = async (req: AuthRequest, res: Response) => {
  const userId = req?.user?.userId as string;
  const { page, size, date, waiterId, status } = getAllOrdersSchema.parse(req.query);

  const allOrders = await orderService.getAllOrders({ page, size, date, waiterId, status });

  res.status(201).json({
    success: true,
    message: 'Orders fetched successfully',
    data: allOrders
  });
};

const changeTable = async (req: AuthRequest, res: Response) => {
  const { id: orderId } = params.parse(req.params);
  const { tableNumber } = changeTableSchema.parse(req.body);

  const order = await orderService.changeTable({ orderId, tableNumber });

  res.status(200).json({
    success: true,
    message: 'Table changed successfully',
    data: order
  });
};

const cancelOrder = async (req: AuthRequest, res: Response) => {
  const { id: orderId } = params.parse(req.params);

  const order = await orderService.cancelOrder(orderId);

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    data: order
  });
};

// const completeOrder = async (req: AuthRequest, res: Response) => {
//     const { id: orderId } = params.parse(req.params);

//     const order = await orderService.completeOrder(orderId);

//     res.status(200).json({
//         success: true,
//         message: 'Order completed successfully',
//         data: order
//     });
// }


/////////////////////////////////////////////////////////





// const completeOrder = async (req: AuthRequest, res: Response) => {
//   const { id: orderId } = params.parse(req.params);
//   try {
//     await orderService.checkStockBeforeCompletion(orderId);
//     const order = await orderService.completeOrder(orderId);
//     await orderService.handleStockOutflowForOrder(order);
//     res.status(200).json({
//       success: true,
//       message: 'Order completed successfully',
//       data: order
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error instanceof Error ? error.message : 'Failed to complete order'
//     });
//   }
// };



const markOrderAsPaid = 
  async (req: Request, res: Response ,next : NextFunction) => {

    const order = await orderService.markOrderAsPaid(req.params.id);
    if(!order) {
      return next(new ApiError(`${req.__('not_found')}`,404));
    }
    res.status(200).json({
      success: true,
      message: 'Order marked as paid successfully',
      data: order
    });
    
  }




const getOrderByCode = async (req: AuthRequest, res: Response) => {
  const { orderCode } = getOrderByCodeSchema.parse(req.params);

  const order = await orderService.getOrderByCode(orderCode);

  res.status(200).json({
    success: true,
    message: 'Order fetched successfully',
    data: order
  });
};

const getOrderById = async (req: AuthRequest, res: Response) => {
  const { id: orderId } = params.parse(req.params);

  const order = await orderService.getOrderById(orderId);

  res.status(200).json({
    success: true,
    message: 'Order fetched successfully',
    data: order
  });
};

const getOrderByTable = async (req: AuthRequest, res: Response) => {
  const { tableNumber } = getOrderByTableSchema.parse(req.params);

  const order = await orderService.getOrderByTable(tableNumber);

  res.status(200).json({
    success: true,
    message: 'Order fetched successfully',
    data: order
  });
};

export const orderCtrl = {
  createOrder,
  addMealToOrder,
  deleteMealFromOrder,
  getAllOrders,
  changeTable,
  cancelOrder,
  markOrderAsPaid,
  getOrderByCode,
  getOrderByTable,
  getOrderById
};
