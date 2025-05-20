import ApiError from "../../utils/apiErrors";
import { pagenation } from "../../utils/pagination";
import { orderRepository } from "./order.repository";
import { ICreateOrderData, ICreateOrderQuery, IOrder, IOrderMealItem, OrderMealStatus, OrderStatus, OrderType } from "./order.types";
import { tableService } from "../Table";
import Meal from "../Meal/meal.schema";
import { subOrderService } from "../subOrder";
import stockSchema from "../Stock/stock.schema";
import mongoose, { FilterQuery } from "mongoose";
import stockOutflowSchema from "../StockOutflow/stockOutflow.schema";

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

    async createOrder(data: ICreateOrderQuery) {
        try {
            const { orderItems, tableNumber, waiterId, type } = data;

            let orderObject: ICreateOrderData = {} as ICreateOrderData;
            orderObject.type = type;
            orderObject.waiterId = waiterId;

            if (type === OrderType.DINE_IN ) {
                if (!tableNumber) {
                    throw new ApiError('يجب عليك تحديد الطاولة', 400)
                }
                //! Check if table is exist
                const table = await tableService.isTableAvalible(tableNumber);
                if(!table) {
                    throw new ApiError('Table not found or not available', 404);
                }
                orderObject.tableNumber = tableNumber;
            }
            
            //! Check is all meal availbale
            let subtotalPrice = 0;
            const newOrderItems: IOrderMealItem[] = [];
            for(const item of orderItems) {
                const meal = await Meal.findById(item.mealId);
                if (!meal || !meal?.isAvailable) {
                    throw new ApiError('Meal not available now', 404);
                }
                
                // console.log(meal)
                // console.log(meal.departmentId)

                const mealObj = meal.toObject();

                subtotalPrice += meal.price * item.quantity;
                newOrderItems.push({
                    mealId: item.mealId,
                    kitchenId: mealObj.kitchenId.toString(),
                    quantity: item.quantity,
                    price: mealObj.price,
                    status: OrderMealStatus.PENDING
                });
            }
            orderObject.orderItems = newOrderItems;
            orderObject.subtotalPrice = subtotalPrice;
            
            const order = await this.orderdDataSource.createOne(orderObject);

            if (tableNumber) {
                await tableService.updateTable({ tableNumber, data: { isAvailable: false } });
            }

            return order;
        } catch (error) {
            console.log(error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Failed to create order', 500);
        }
    }


    // async createOrder(data: ICreateOrderQuery) {
    //     try {
    //       const { orderItems, tableNumber, waiterId, type } = data;
      
    //       let orderObject: ICreateOrderData = {} as ICreateOrderData;
    //       orderObject.type = type;
    //       orderObject.waiterId = waiterId;
      
    //       if (type === OrderType.DINE_IN) {
    //         if (!tableNumber) {
    //           throw new ApiError("يجب عليك تحديد الطاولة", 400);
    //         }
    //         // 1. تأكد من وجود الترابيزة وحالتها
    //         const table = await tableService.isTableAvalible(tableNumber);
    //         if (!table) {
    //           throw new ApiError("الترابيزة غير موجودة أو مش متاحة", 404);
    //         }
    //         orderObject.tableNumber = tableNumber;
    //       }
      
    //       // 2. تأكد من وجود الوجبات المطلوبة
    //       // 3. تأكد من وجود مكونات كافية في المخزون لكل وجبة
    //       let subtotalPrice = 0;
    //       const newOrderItems: IOrderMealItem[] = [];
      
    //       // لجمع كميات المكونات المطلوبة لكل stockItemId
    //       const requiredStockMap = new Map<string, number>();
      
    //       // اجلب الوجبات دفعة واحدة
    //       const mealIds = orderItems.map(item => item.mealId);
    //       const meals = await Meal.find({ _id: { $in: mealIds } }) as any[];  // هنا أضفنا as any[] عشان نتفادى الخطأ
      
    //       for (const item of orderItems) {
    //         const meal = meals.find(m => m._id.toString() === item.mealId);
    //         if (!meal || !meal.isAvailable) {
    //           throw new ApiError("الوجبة غير متوفرة حاليا", 404);
    //         }
      
    //         // حساب السعر الكلي
    //         subtotalPrice += meal.price * item.quantity;
      
    //         // إضافة الوجبة للطلب
    //         newOrderItems.push({
    //           mealId: meal._id.toString(),
    //           kitchenId: meal.kitchenId.toString(),
    //           quantity: item.quantity,
    //           price: meal.price,
    //           status: OrderMealStatus.PENDING,
    //         });
      
    //         // جمع كمية المكونات المطلوبة للمخزون
    //         for (const ingredient of meal.ingredients) {
    //           const currentNeeded = requiredStockMap.get(ingredient.stockItemId.toString()) || 0;
    //           const totalNeeded = ingredient.quantityUsed * item.quantity;
    //           requiredStockMap.set(ingredient.stockItemId.toString(), currentNeeded + totalNeeded);
    //         }
    //       }
      
    //       // 3. تحقق من توفر الكميات المطلوبة في المخزون
    //       for (const [stockItemId, requiredQty] of requiredStockMap.entries()) {
    //         const stockItem = await stockSchema.findById(stockItemId);
    //         if (!stockItem) {
    //           throw new ApiError(`مكون المخزون غير موجود: ${stockItemId}`, 404);
    //         }
    //         if (stockItem.quantity < requiredQty) {
    //           throw new ApiError(`كمية المكون ${stockItem.nameOfItem} غير كافية في المخزون`, 400);
    //         }
    //       }
      
    //       // 4. خصم الكميات المطلوبة من المخزون لكل مكون
    //       const stockOutflowRecords = [];
    //       for (const [stockItemId, requiredQty] of requiredStockMap.entries()) {
    //         const stockItem = await stockSchema.findById(stockItemId);
    //         if (!stockItem) continue;
      
    //         stockItem.quantity -= requiredQty;
    //         await stockItem.save();
      
    //         // 5. تسجيل الخصم في جدول StockOutflow
    //         const stockOutflow = await stockOutflowSchema.create({
    //           stockId: stockItem._id,
    //           quantityUsed: requiredQty,
    //           orderId: null,  // سيتم التحديث بعد إنشاء الطلب
    //           date: new Date(),
    //         });
      
    //         stockOutflowRecords.push(stockOutflow);
    //       }
      
    //       // 6. إنشاء الطلب
    //       orderObject.orderItems = newOrderItems;
    //       orderObject.subtotalPrice = subtotalPrice;
    //       orderObject.stockOutflows = stockOutflowRecords.map(o => o._id); // تأكد أن خاصية stockOutflows موجودة في ICreateOrderData
      
    //       const order = await this.orderdDataSource.createOne(orderObject); // بدون تمرير session
      
    //       if (!order) {
    //         throw new ApiError("فشل في إنشاء الطلب، الطلب فارغ", 500);
    //       }
      
    //       // بعد إنشاء الطلب، نربط سجلات StockOutflow بالطلب
    //       await stockOutflowSchema.updateMany(
    //         { orderId: null },
    //         { orderId: order._id }
    //       );
      
    //       // 7. تحديث حالة الترابيزة إلى "مشغولة"
    //       if (tableNumber) {
    //         await tableService.updateTable({ tableNumber, data: { isAvailable: false } });  // بدون تمرير session
    //       }
      
    //       return order;
    //     } catch (error) {
    //       console.log(error);
    //       if (error instanceof ApiError) {
    //         throw error;
    //       }
    //       throw new ApiError("فشل في إنشاء الطلب", 500);
    //     }
    //   }
      


    async addMealToOrder({ orderId, orderItem }: { orderId: string, orderItem: { mealId: string, quantity: number } }) {
        try {
            let { orderItems, subtotalPrice } = await this.isOrderExist(orderId);
            
            const meal = await Meal.findById(orderItem.mealId);
            // if (!meal || !meal?.isAvailable) {
            if(!meal) {
                throw new ApiError('Meal not available now', 404);

            }
            const mealObj = meal.toObject();
            //! Update order items if meal is already in order
            orderItems = orderItems.filter(item => item.mealId.toString() !== orderItem.mealId.toString());
            orderItems.push({
                mealId: orderItem.mealId,
                kitchenId: mealObj.kitchenId.toString(),
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
            if (order.type === OrderType.TAKEAWAY && !order?.tableNumber) {
                throw new ApiError('هذا الطلب ليس لديه طاولات', 400)
            }

            const table = await tableService.isTableAvalible(tableNumber);
            if(!table) {
                throw new ApiError('Table not found or not available', 404);
            }
            if(order.tableNumber === tableNumber) {
                throw new ApiError('Table is already assigned to this order', 400);
            }

            const updatedOrder = await this.orderdDataSource.updateOne({ _id: orderId }, { tableNumber });
            
            if (order?.tableNumber) {
                await tableService.updateTable({ tableNumber: order?.tableNumber, data: { isAvailable: true } });
                await tableService.updateTable({ tableNumber, data: { isAvailable: false } });
            }
            
            return updatedOrder; 
        } catch (error) {
            if(error instanceof ApiError) throw error
            throw new ApiError('Failed to change table', 500);
        }
    }

    async findOne(query: FilterQuery<IOrder>) {
        const order = await this.orderdDataSource.findOne(query);
        if(!order) {
            throw new ApiError('الطلب غير موجود', 404)
        }
        return order;
    }
    async getOrderByCode(orderCode: string) {
        return await this.findOne({ orderCode })
    }

    async getOrderById(orderId: string) {
        return await this.findOne({ _id: orderId })  
    }

    async getOrderByTable(tableNumber: number) {
        return await this.findOne({ tableNumber, isPaid: false });
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
            
            const cancelledOrder = await this.orderdDataSource.updateOne({ _id: orderId }, { status: OrderStatus.CANCELLED });
            
            if (order.tableNumber) {
                await tableService.updateTable({ tableNumber: order.tableNumber, data: { isAvailable: true } });
            }

            return cancelledOrder
        } catch (error) {
            if(error instanceof ApiError) throw error
            throw new ApiError('Failed to cancel order', 500);
        }
    }

    // async completeOrder(orderId: string) {
    //     try {
    //         const order = await this.isOrderExist(orderId);
    //         if(order.status === OrderStatus.CANCELLED) {
    //             throw new ApiError('Order is already cancelled', 400);
    //         }
    //         if(order.status === OrderStatus.COMPLETED) {
    //             throw new ApiError('Order is already completed', 400);
    //         }
    //         return this.orderdDataSource.updateOne({ _id: orderId }, { status: OrderStatus.COMPLETED });
    //     } catch (error) {
    //         if(error instanceof ApiError) throw error
    //         throw new ApiError('Failed to complete order', 500);
    //     }
    // }


    async completeOrder(orderId: string) {
        try {
          const order = await this.isOrderExist(orderId);
          if (order.status === OrderStatus.CANCELLED) {
            throw new ApiError('Order is already cancelled', 400);
          }
          if (order.status === OrderStatus.COMPLETED) {
            throw new ApiError('Order is already completed', 400);
          }
      
          await this.orderdDataSource.updateOne({ _id: orderId }, { status: OrderStatus.COMPLETED });
      
        //   // خصم الكميات من المخزون
        //   await this.deductStockForOrder(orderId);
      
          return { message: 'Order completed successfully' };
        } catch (error) {
          if (error instanceof ApiError) throw error;
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



    // async deductStockForOrder(orderId: string) {
    //     try {
    //         const order = await this.isOrderExist(orderId);
    //         if (order.status !== OrderStatus.COMPLETED) {
    //             throw new ApiError('Only completed orders can update stock', 400);
    //         }
    
    //         const stockUsageMap = new Map<string, number>();
    
    //         for (const item of order.orderItems) {
    //             const meal = await Meal.findById(item.mealId).populate('ingredients.stockItemId');
    //             if (!meal) continue;
    
    //             const mealQty = item.quantity;
    
    //             for (const ingredient of meal.ingredients) {
    //                 const stockId = (ingredient.stockItemId as any )._id.toString();
    //                 const usedQty = ingredient.quantityUsed * mealQty;
    
    //                 const stockUsage = stockUsageMap.get(stockId) || 0;
    //                 stockUsageMap.set(stockId, stockUsage + usedQty);
    //             }
    //         }
    
    //         // تحديث المخزون 
    //         for (const [stockId, totalUsed] of stockUsageMap.entries()) {
    //             const stockItem = await stockSchema.findById(stockId);
    //             if (!stockItem) continue;
    
    //             if (stockItem.quantity < totalUsed) {
    //                 throw new ApiError(`Insufficient stock for ${stockItem.nameOfItem}`, 400);
    //             }
    //             stockItem.quantity -= totalUsed;
    //             await stockItem.save();
    //         }
    
    //         return {
    //             success: true,
    //             message: 'Stock updated successfully'
    //         };
    //     } catch (error) {
    //         if (error instanceof ApiError) throw error;
    //         throw new ApiError('Failed to update stock', 500);
    //     }
    // }
    
}

export const orderService = new OrderService() 
