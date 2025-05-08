import ApiError from "../../utils/apiErrors";
import { pagenation } from "../../utils/pagination";
import { orderRepository } from "./order.repository";
import { ICreateOrder, IOrder, IOrderMealItem, OrderMealStatus, OrderStatus } from "./order.types";
import { tableService } from "../Table";
import Meal from "../Meal/meal.schema";
import { subOrderService } from "../subOrders";

class OrderService {

    constructor(private readonly orderdDataSource = orderRepository) {}

    async isOrderExist(orderId: string) {
        const order = await this.orderdDataSource.findOne({_id : orderId});
        if (!order) {
            throw new ApiError('الطلب غير موجود', 404);
        }
        return order;
    }

    async findOrderById(orderId: string) {
        return this.orderdDataSource.findOne({ _id : orderId});
    }

    async updateOrder({ orderId, data }: { orderId: string, data: Partial<IOrder> }) {
        const updatedOrder = await this.orderdDataSource.updateOne({_id : orderId}, data);
        if (!updatedOrder) {
            throw new ApiError('Failed to update order', 500);
        }
        return updatedOrder;
    }

    async createOrder(data: ICreateOrder) {
        try {
            const { orderItems, tableNumber, waiterId } = data;
            //! Check if table is exist
            const table = await tableService.isTableAvalible(tableNumber);
            if(!table) {
                throw new ApiError('Table not found or not available', 404);
            }
            
            //! Check is all meal availbale
            let subtotalPrice = 0;
            const newOrderItems: IOrderMealItem[] = [];
            for(const item of orderItems) {
                const meal = await Meal.findById(item.mealId);
                // if (!meal || !meal?.isAvailable) {
                if(!meal) {
                    throw new ApiError('Meal not availble now', 404);
                }
                
                // console.log(meal)
                // console.log(meal.departmentId)

                const mealObj = meal.toObject();

                subtotalPrice += meal.price * item.quantity;
                newOrderItems.push({
                    mealId: item.mealId,
                    departmentId: mealObj.departmentId.toString(),
                    quantity: item.quantity,
                    price: mealObj.price,
                    status: OrderMealStatus.PENDING
                });
            }
            // console.log(newOrderItems);
            const order = await this.orderdDataSource.createOne({
                waiterId,
                tableNumber,
                orderItems: newOrderItems,
                subtotalPrice, 
                status: OrderStatus.PENDING 
            });

            await tableService.updateTable({ tableNumber, data: { isAvailable: false } });

            return order;
        } catch (error) {
            console.log(error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Failed to create order', 500);
        }
    }

    async addMealToOrder({ orderId, orderItem }: { orderId: string, orderItem: { mealId: string, quantity: number } }) {
        try {
            let { orderItems, subtotalPrice } = await this.isOrderExist(orderId);
            
            const meal = await Meal.findById(orderItem.mealId);
            // if (!meal || !meal?.isAvailable) {
            if(!meal) {
                throw new ApiError('Meal not availble now', 404);
            }
            const mealObj = meal.toObject();
            //! Update order items if meal is already in order
            orderItems = orderItems.filter(item => item.mealId.toString() !== orderItem.mealId.toString());
            orderItems.push({
                mealId: orderItem.mealId,
                departmentId: mealObj.departmentId.toString(),
                quantity: orderItem.quantity,
                price: meal.price,
                status: OrderMealStatus.PENDING
            });
            
            subtotalPrice = orderItems.reduce(
                (acc, item) => acc + item.price * item.quantity, 0
            );
           
            const updatedOrder = await this.orderdDataSource.updateOne(
                { _id: orderId }, 
                { subtotalPrice, orderItems });
            
            return updatedOrder;
        } catch (error) {
            if(error instanceof ApiError) throw error
            throw new ApiError('Failed to add meal to order', 500);
        }
    }

    async deleteMealFromOrder({ orderId, mealId }: { orderId: string, mealId: string }) {
        try {
            let { orderItems, subtotalPrice } = await this.isOrderExist(orderId);
            
            const orderItem = orderItems.find(
                item => item.mealId.toString() === mealId.toString()
            ) as IOrderMealItem;

            if (!orderItem) {
                throw new ApiError('Meal not found in order', 404);
            }

            subtotalPrice -= orderItem.price * orderItem.quantity;
            
            orderItems = orderItems.filter(
                item => item.mealId.toString() !== mealId.toString()
            );
            
            const updatedOrder = await this.orderdDataSource.updateOne(
                { _id: orderId }, 
                { subtotalPrice, orderItems }
            );
            
            return updatedOrder;
        } catch (error) {
            if(error instanceof ApiError) throw error
            throw new ApiError('Failed to delete meal from order', 500);
        }
    } 

    async deleteOrder(orderId: string) {
        try {
            await this.isOrderExist(orderId);
            const result = await this.orderdDataSource.deleteOne({_id : orderId});
            if(!result) throw new ApiError('Failed to delete order', 500);
            return result;
        } catch (error) {
            if(error instanceof ApiError) throw error
            throw new ApiError('Failed to delete order', 500);
        }
    }

    async getAllOrders({ page, size, date, waiterId, status }: { page: number, size: number, date?: Date, waiterId?: string, status?: OrderStatus }) {
        try {
            const query: any = {};
            if (date) {
                query.createdAt = { $gte: date };
            }
            if (waiterId) {
                query.waiterId = waiterId;
            }
            if (status) {
                query.status = status;
            }
            console.log(query);
            const { limit, skip } = pagenation({ page, size });
            return this.orderdDataSource.findMany(query, { limit, skip });       
        } catch (error) {
            if(error instanceof ApiError) throw error
            throw new ApiError('failed to get orders', 500);
        }
    }

    async changeTable({ orderId, tableNumber }: { orderId: string, tableNumber: number }) {
        try {
            const order = await this.isOrderExist(orderId);
            const table = await tableService.isTableAvalible(tableNumber);
            if(!table) {
                throw new ApiError('Table not found or not available', 404);
            }
            if(order.tableNumber === tableNumber) {
                throw new ApiError('Table is already assigned to this order', 400);
            }
            await tableService.updateTable({ tableNumber: order.tableNumber, data: { isAvailable: true } });
            await tableService.updateTable({ tableNumber, data: { isAvailable: false } });
            return this.orderdDataSource.updateOne({ _id: orderId }, { tableNumber });
        } catch (error) {
            if(error instanceof ApiError) throw error
            throw new ApiError('Failed to change table', 500);
        }
    }

    async getOrderByCode(orderCode: string) {
        return this.orderdDataSource.findOne({ orderCode });
    }

    async cancelOrder(orderId: string) {
        try {
            const order = await this.isOrderExist(orderId);
            if(order.status === OrderStatus.COMPLETED) {
                throw new ApiError('Order is already completed', 400);
            }
            if(order.status === OrderStatus.CANCELLED) {
                throw new ApiError('Order is already cancelled', 400);
            }
            await tableService.updateTable({ tableNumber: order.tableNumber, data: { isAvailable: true } });
            return this.orderdDataSource.updateOne({ _id: orderId }, { status: OrderStatus.CANCELLED });
        } catch (error) {
            if(error instanceof ApiError) throw error
            throw new ApiError('Failed to cancel order', 500);
        }
    }

    async completeOrder(orderId: string) {
        try {
            const order = await this.isOrderExist(orderId);
            if(order.status === OrderStatus.CANCELLED) {
                throw new ApiError('Order is already cancelled', 400);
            }
            if(order.status === OrderStatus.COMPLETED) {
                throw new ApiError('Order is already completed', 400);
            }
            return this.orderdDataSource.updateOne({ _id: orderId }, { status: OrderStatus.COMPLETED });
        } catch (error) {
            if(error instanceof ApiError) throw error
            throw new ApiError('Failed to complete order', 500);
        }
    }

    async sendOrderForDepartments(order: IOrder) {
        // console.log(order);
        try {
           const subOrders = await subOrderService.createAllSubOrders(order);
           for (const subOrder of subOrders.values()) {
                // Print subOrder
           }
        } catch (error) {
            if(error instanceof ApiError) throw error
            throw new ApiError('Failed to send order for departments', 500);
        }
    }
}

export const orderService = new OrderService() 
