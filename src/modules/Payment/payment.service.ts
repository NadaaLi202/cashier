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
            const { orderId, discount, paymentMethods } = data;
            
            // check if order exists and avalible
            const order = await orderService.isOrderExist(orderId);
            if (!order) {
                throw new ApiError('Order not found', 404);
            }
            if(order.status === OrderStatus.CANCELLED) {
                throw new ApiError('Order is cancelled', 400);
            }
            if (order.status !== OrderStatus.COMPLETED) {
                throw new ApiError('Order is not completed yet', 400);
            }
            if (order.isPaid) {
                throw new ApiError('Order is already paid', 400);
            }

            // check if discount is valid
            const orderTotalAmount = order.totalPrice;
            let expectedValue = orderTotalAmount;
            const totalAmount = paymentMethods.reduce((acc, curr) => acc + curr.amount, 0);
            if (discount) {
                if (discount > orderTotalAmount) {
                    throw new ApiError('Discount is greater than amount', 400);
                }
                expectedValue -= ((orderTotalAmount * discount) / 100);
            }

            // check if total amount is correct
            if (expectedValue != totalAmount) {
                throw new ApiError('total amount is not correct', 400);
            }
            
            const payment = await this.paymentDataSource.createOne({ ...data, totalAmount });
            await orderService.updateOrder({ orderId, data: { isPaid: true } });
            if (order?.tableNumber) {
                await tableService.updateTable({ tableNumber: order.tableNumber, data: { isAvailable: true } });
            }
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
                query.paymentMethods = { $elemMatch: { method: paymentMethod } };
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



