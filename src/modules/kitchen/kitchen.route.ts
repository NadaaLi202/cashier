
import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware";
import { UserRoles } from "../User/users.interface";
import kitchensService from "./kitchen.service";
import kitchenValidation from "./kitchen.validation";

const kitchenRouter: Router = Router();

kitchenRouter.get('/', kitchensService.getAllKitchens);
kitchenRouter.get('/:id', kitchenValidation.getOne, kitchensService.getKitchenById);

kitchenRouter.post('/',
    isAuthenticated([UserRoles.MANAGER]),
    kitchensService.uploadImage,
    kitchensService.saveImage,
    kitchenValidation.createOne,
    kitchensService.createKitchen
);

kitchenRouter.put('/:id',
    isAuthenticated([UserRoles.MANAGER]),
    kitchensService.uploadImage,
    kitchensService.saveImage,
    kitchenValidation.updateOne,
    kitchensService.updateKitchen
);

kitchenRouter.delete('/:id',
    isAuthenticated([UserRoles.MANAGER]),
    kitchenValidation.deleteOne,
    kitchensService.deleteKitchen
);

export default kitchenRouter;
