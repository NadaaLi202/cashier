import ApiError from "../../utils/apiErrors";
import { pagenation } from "../../utils/pagination";
import { IOrder, orderRepository, orderService, OrderStatus } from "../Order";
import { ITable, tableService } from "../Table";
import { paymentRepository } from "./payment.repository";
import { ICreatePayment, PaymentMethod } from "./payment.types";

class PaymentService {
    constructor(private readonly paymentDataSource = paymentRepository) {}

    async createPayment(data: ICreatePayment) {
        try {
            const { orderId, amount, discount, paymentMethod } = data;
            
            // check if order exists and avalible
            const order = await orderService.isOrderExist(orderId);
            if (!order) {
                throw new ApiError('Order not found', 404);
            }
            if(order.status === OrderStatus.COMPLETED) {
                throw new ApiError('Order is already completed', 400);
            }
            if(order.status === OrderStatus.CANCELLED) {
                throw new ApiError('Order is cancelled', 400);
            }

            // check if discount is valid
            const updatedOrderData: Partial<IOrder> = {};
            if (discount) {
                const expectedValue = order.totalPrice - ((order.totalPrice * discount) / 100);
                if (expectedValue > amount) {
                    throw new ApiError('Discount is greater than amount', 400);
                }
                updatedOrderData.discount = discount;
            }
            updatedOrderData.status = OrderStatus.COMPLETED;

            const payment = await this.paymentDataSource.createOne(data);
            
            const updatedOrder = await orderService.updateOrder({ orderId, data: updatedOrderData });
            
            const updateTable = await tableService.updateTable({ tableNumber: order.tableNumber, data: { isAvailable: true } });
            
            // Print reset for payment
            
            return payment;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Failed to create payment', 500);
        }
    }
    
    async getAllPayments(
        { page, size, paymentMethod, date }:
        { page: number, size: number, paymentMethod?: PaymentMethod, date?: Date }
    ) {
        try {
            let query: any = {};
            if(paymentMethod) {
                query.paymentMethod = paymentMethod;
            }
            if(date) {
                query.createdAt = { $gte: date };
            }
            const { skip, limit } = pagenation({ page, size }) 
            const payments = await this.paymentDataSource.findMany(query, { skip, limit });
            return payments;
        } catch (error) {
            throw new ApiError('Failed to get all payments', 500);
        }
    }

    async getPaymentById(paymentId: string) {
        try {
            const payment = await this.paymentDataSource.findOne({ _id: paymentId });
            return payment;
        } catch (error) {
            throw new ApiError('Failed to get payment by id', 500);
        }
    }
}

export const paymentService = new PaymentService();



