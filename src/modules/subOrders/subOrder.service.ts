import { ISubOrder } from "./subOrder.types";
import ApiError from "../../utils/apiErrors";
import { subOrderRepository } from "./subOrder.repository";
import { ICreateSubOrder } from "./subOrder.types";
import { IOrder } from "../Order";

class SubOrderService {

    constructor(private readonly subOrderDataSource = subOrderRepository) {}

    async isSubOrderExist(subOrderId: string) {
        const isSubOrderExist = await this.subOrderDataSource.findOne({ _id: subOrderId });
        if(!isSubOrderExist) {
            throw new ApiError('هذا الطلب غير موجود', 404);
        }
        return isSubOrderExist;
    }

    async createAllSubOrders(order: IOrder) {
        try {
            const subOrdersMap = new Map<string, ICreateSubOrder>();
            for (const orderItem of order.orderItems) {
                if(subOrdersMap.has(orderItem.departmentId)) {
                    const subOrder = subOrdersMap.get(orderItem.departmentId) as ICreateSubOrder;
                    subOrder.orderItems.push(orderItem);
                    subOrdersMap.set(orderItem.departmentId, subOrder);
                } else {
                    subOrdersMap.set(orderItem.departmentId, { orderItems: [orderItem], departmentId: orderItem.departmentId, orderId: order._id });
                }
            }

            // for (const subOrder of subOrdersMap.values()) {
            //     await this.subOrderDataSource.createOne(subOrder);
            //     // Send Notification to department
            // }

            return subOrdersMap;
        } catch (error) {
            throw new ApiError('حدث خطأ أثناء إنشاء الطلبات الفرعية', 500);
        }
    }

    async getSubOrdersByOrderId(orderId: string) {
        return this.subOrderDataSource.findMany({ orderId });
    }

    async getSubOrderById(subOrderId: string) {
        return this.isSubOrderExist(subOrderId);
    }

    async deleteSubOrderById(subOrderId: string) {
        try {
            await this.isSubOrderExist(subOrderId);
            return this.subOrderDataSource.deleteOne({ _id: subOrderId });
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('حدث خطأ أثناء حذف الطلب الفرعي', 500);
        }
    }

    async updateSubOrderById(subOrderId: string, data: Partial<ISubOrder>) {
        try {
            await this.isSubOrderExist(subOrderId);
            return this.subOrderDataSource.updateOne({ _id: subOrderId }, data);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('حدث خطأ أثناء تحديث الطلب الفرعي', 500);
        }
    }
} 

export const subOrderService = new SubOrderService();