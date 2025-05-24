


import mongoose from "mongoose"
import { Meal } from "./meal.interface"

const mealSchema = new mongoose.Schema({
    name : {type : String , required : true },
    image : {
        url: {type : String, default : 'meal-default.png'},
        publicId : {type : String, default : ''}
    }, 

    managerId : {type : mongoose.Schema.Types.ObjectId, ref : 'Users' , required : true},
    kitchenId : {type : mongoose.Schema.Types.ObjectId, ref : 'Kitchens' , required : true},
    notes : {type : String },
    ingredients : [
        {
            stockItemId:
            { 
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Stock',
                required : true
            },
            quantityUsed: 
            {
                type : Number,
                required : true,
                min : 0.01
            },
            unit : {
                type : String,
                required : true,
                default : 'pcs'
            },
        },
    ],
    price : {type : Number , required : true},
    category : {type : String, required : true},
    isAvailable : {type: Boolean, default: "true"}

    // category : {type : String, enum : ['breakfast', 'lunch', 'dinner', 'drinks','snacks'] , required : true},
},{timestamps : true})

const imagesUrl = (document: Meal) => {
    if (
      document.image &&
      typeof document.image === 'object' &&
      'url' in document.image &&
      typeof document.image.url === 'string' &&
      document.image.url.startsWith('meal')
    ) {
      document.image.url = `${process.env.BASE_URL}/images/meal/${document.image.url}`
    }
  };
mealSchema.post('save',imagesUrl);

export default mongoose.model<Meal>('Meal',mealSchema);
