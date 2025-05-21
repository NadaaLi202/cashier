import mongoose, { Schema } from "mongoose"
import { Kitchen } from "./kitchen.interface";

const kitchenSchema = new mongoose.Schema<Kitchen>({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    image: {
        url : {type: String, default : 'kitchen-default.png'},
        publicId : {type: String , default : ''}
    },

    managerId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    isActive: { type: Boolean, trim: true, default: true },
}, { timestamps: true });

const imagesUrl = (document : Kitchen) => {

    if (
        document.image &&
        typeof document.image === 'object' &&
        'url' in document.image &&
        typeof document.image.url === 'string' &&
        document.image.url.startsWith('kitchen')
    ){
        document.image.url = `${process.env.BASE_URL}/images/kitchen/${document.image.url}`
    }

};

kitchenSchema.post('save',imagesUrl);

export default mongoose.model<Kitchen>('Kitchens', kitchenSchema);