import { Router } from "express";
import { isAuthunticated } from "../../middleware/auth.middleware";
import { UserRoles } from "../users/users.interface";
import { tableCtrl } from "./table.controller";
import asyncHandler from "express-async-handler";

const router = Router();

router.route('/')
    .post( 
        isAuthunticated([ UserRoles.MANAGER ]),
        asyncHandler(tableCtrl.addTable)
    )
    .get(
        isAuthunticated([ UserRoles.MANAGER ]),
        asyncHandler(tableCtrl.getAllTables)
    )

router.
    route('/:tableNumber')
    .patch(
        isAuthunticated([UserRoles.MANAGER]),
        asyncHandler(tableCtrl.updateTable)
    )
    .delete(
        isAuthunticated([ UserRoles.MANAGER ]),
        asyncHandler(tableCtrl.deleteTable)
    )



export const tableRoutes = router;