
import { Router } from "express";

import {
  registerArrive,
  registerOutput,
} from "../../../controllers/actions/reservation.actions.controllers";
import { arrayValidatorAccess } from "../../../middlewares/validattions-access-list";
import {
  valStrucutrePutRegisterArrive,
  valStructurePutRegisterOutput,
  valDatabasePut,
} from "./reservation.actions.validations";


const router = Router();


router.put("/register-arrive/:id_cat_reservation", 
  arrayValidatorAccess,
  valStrucutrePutRegisterArrive,
  valDatabasePut,
  registerArrive,
);

router.put("/register-output/:id_cat_reservation",
  arrayValidatorAccess,
  valStructurePutRegisterOutput,
  valDatabasePut,
  registerOutput,
);


export default router;
