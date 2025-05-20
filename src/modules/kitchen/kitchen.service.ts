import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { Kitchen } from "./kitchen.interface";
import sharp from "sharp";
import ApiError from "../../utils/apiErrors";
import { uploadSingleFile } from "../../middleware/uploadFiles.middleware";
import kitchenSchema from "./kitchen.schema";
import cloudinary from "../../utils/cloudinary";

class KitchensService {

    // Middleware to handle image upload using multer
    uploadImage = uploadSingleFile(['image'], 'image');

    // Save image using sharp and Cloudinary
    saveImage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.file) {
                const buffer = await sharp(req.file.buffer)
                    .resize(1200, 1200)
                    .webp({ quality: 95 })
                    .toBuffer();

                const uploadFromBuffer = (buffer: Buffer) => {
                    return new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            {
                                resource_type: "image",
                                folder: "kitchens",
                                format: "webp",
                            },
                            (error, result) => {
                                if (error) {
                                    console.error("Cloudinary Error:", error); // Debug
                                    reject(error);
                                } else {
                                    resolve(result);
                                }
                            }
                        );
                        stream.write(buffer);
                        stream.end();
                    });
                };

                const result: any = await uploadFromBuffer(buffer);
                req.body.image = result.secure_url;
            }
            next();
        } catch (error) {
            console.error("Upload failed:", error); // Debug
            return next(new ApiError('Image upload failed', 500));
        }
    };

    

    createKitchen = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const kitchen: Kitchen = await kitchenSchema.create(req.body);
        if (!kitchen) {
            return next(new ApiError(`${req.__('not_found')}`, 404));
        }
        res.status(201).json({ message: "Kitchen created successfully", data: kitchen });
    });

    getKitchenById = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const kitchen: Kitchen | null = await kitchenSchema.findById(req.params.id);
        if (!kitchen) {
            return next(new ApiError(`${req.__('not_found')}`, 404));
        }
        res.status(200).json({ message: "Kitchen fetched successfully", data: kitchen });
    });

    getAllKitchens = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const kitchens: Kitchen[] = await kitchenSchema.find();
        res.status(200).json({ message: "Kitchens fetched successfully", data: kitchens });
    });

    updateKitchen = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const kitchen: Kitchen | null = await kitchenSchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!kitchen) {
            return next(new ApiError(`${req.__('not_found')}`, 404));
        }
        res.status(200).json({ message: "Kitchen updated successfully", data: kitchen });
    });

    deleteKitchen = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const kitchen: Kitchen | null = await kitchenSchema.findByIdAndDelete(req.params.id);
        if (!kitchen) {
            return next(new ApiError(`${req.__('not_found')}`, 404));
        }
        res.status(200).json({ message: "Kitchen deleted successfully", data: kitchen });
    });
}

const kitchensService = new KitchensService();
export default kitchensService;
