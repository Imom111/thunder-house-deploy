
import { Router } from "express";
import { check, param, query } from "express-validator";

import {
  equipmentGetAll,
  equipmentDelete,
  equipmentPost,
  equipmentPut,
  equipmentGet,
  equipmentDeletePhysical,
} from "../../controllers/catalogs/equipment.controllers";
import {
  validateFields,
} from "../../middlewares";
import {
  equipmentExistsById,
} from "../../helpers/db-validators";
import { arrayValidatorAccess } from "../../middlewares/validattions-access-list";


const router = Router();

router.get("/", 
  arrayValidatorAccess,
  [
    query("limit", "field (limit) should be integer and greater than 0").isInt({ min: 1 }).optional().default(null),
    query("page", "field (page) should be integer and greater than 0").isInt({ min: 1 }).optional().default(null),
    query("pagination", "field (pagination) should be boolean").isBoolean().optional().default(false),
    validateFields,
  ],
  equipmentGetAll,
);

router.get("/:id_cat_equipment", 
  arrayValidatorAccess,
  [
    param("id_cat_equipment", "field (id_cat_equipment) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_equipment").custom(equipmentExistsById()),
    validateFields,
  ],
  equipmentGet,
);

router.put("/:id_cat_equipment", 
  arrayValidatorAccess,
  [
    param("id_cat_equipment", "field (id_cat_equipment) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_equipment").custom(equipmentExistsById(false)),
    check("equipment", "field (equipment) is required").not().isEmpty(),
    check("status", "field (status) is required").not().isEmpty(),
    check("status", "field (status) should be boolean").isBoolean(),
    validateFields,
  ],
  equipmentPut,
);

router.post("/", 
  arrayValidatorAccess,
  [
    check("equipment", "field (equipment) is required").not().isEmpty(),
    check("total_number_people", "field (total_number_people) is required, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    validateFields,
  ],
  equipmentPost,
);

router.delete("/:id_cat_equipment", 
  arrayValidatorAccess,
  [
    param("id_cat_equipment", "field (id_cat_equipment) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_equipment").custom(equipmentExistsById()),
    validateFields,
  ],
  equipmentDelete,
);

router.delete("/physical/:id_cat_equipment", 
  arrayValidatorAccess,
  [
    param("id_cat_equipment", "field (id_cat_equipment) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_equipment").custom(equipmentExistsById()),
    validateFields,
  ],
  equipmentDeletePhysical,
);

export default router;
