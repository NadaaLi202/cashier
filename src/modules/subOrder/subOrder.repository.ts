import { FilterQuery, Model, UpdateQuery } from "mongoose";
import { SubOrder } from "./SubOrder";

class SubOrderRepository<T> {

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

    async findMany(query: FilterQuery<T>): Promise<T[]> {
        return this.orderModel.find(query);
    }

    async deleteOne(query: FilterQuery<T>): Promise<boolean> {
        const result = await this.orderModel.deleteOne(query);
        return result.deletedCount > 0;
    }
}

export const subOrderRepository = new SubOrderRepository(SubOrder);

