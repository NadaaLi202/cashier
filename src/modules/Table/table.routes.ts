import { Router } from "express";
import { isAuthunticated } from "../../middleware/auth.middleware";
import { UserRoles } from "../users/users.interface";
import { tableCtrl } from "./table.controller";

const router = Router();

router.route('/')
    .post( 
        isAuthunticated([ UserRoles.MANAGER ]),
        tableCtrl.addTable
    )
    .get(
        isAuthunticated([ UserRoles.MANAGER ]),
        tableCtrl.getAllTables
    )

router.
    route('/:tableNumber')
    .put(
        isAuthunticated([UserRoles.MANAGER]),
        tableCtrl.updateTable
    )
    .delete(
        isAuthunticated([ UserRoles.MANAGER ]),
        tableCtrl.deleteTable
    )



export const tableRoutes = router;