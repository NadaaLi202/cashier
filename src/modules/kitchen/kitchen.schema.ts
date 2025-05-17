import mongoose, { Schema } from "mongoose"
import { Kitchen } from "./kitchen.interface";

const kitchenSchema = new mongoose.Schema<Kitchen>({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    isActive: { type: Boolean, trim: true, default: true },
}, { timestamps: true });

const imagesUrl = (document : Kitchen) => {

    if(document.image && document.image.startsWith('kitchen'))  document.image = `${process.env.BASE_URL}/images/kitchen/${document.image}`
};

kitchenSchema.post('save',imagesUrl);

export default mongoose.model<Kitchen>('Kitchens', kitchenSchema);