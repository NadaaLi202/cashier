import { FilterQuery, Model, UpdateQuery } from "mongoose";
import { Payment } from "./payment.schema";
import { IPayment } from "./payment.types";

class OrderRepository<T = IPayment> {

    constructor(private orderModel: Model<T>) {}

    async createOne(data: Partial<T>): Promise<T> {
        return this.orderModel.create(data);
    }

    async updateOne(query: FilterQuery<T>, data: UpdateQuery<T>): Promise<T | null> {
        return  this.orderModel.findByIdAndUpdate(query, data, { new: true });
    }

    async findOne(query: FilterQuery<T>): Promise<T | null> {
        return this.orderModel.findById(query);
    }

    async findMany(query: FilterQuery<T>, { limit, skip }: { limit: number, skip: number }): Promise<T[]> {
        return this.orderModel.find(query).limit(limit).skip(skip);
    }

    async deleteOne(query: FilterQuery<T>): Promise<boolean> {
        const result = await this.orderModel.deleteOne(query);
        return result.deletedCount > 0;
    }
}

export const paymentRepository = new OrderRepository(Payment);

