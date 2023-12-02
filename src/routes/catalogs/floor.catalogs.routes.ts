
import { Router } from "express";
import { check, param, query } from "express-validator";

import {
  floorGetAll,
  floorDelete,
  floorPost,
  floorPut,
  floorGet,
  floorDeletePhysical,
} from "../../controllers/catalogs/floor.controllers";
import {
  validateFields,
} from "../../middlewares";
import {
  floorExistsById,
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
  floorGetAll,
);

router.get("/:id_cat_floor", 
  arrayValidatorAccess,
  [
    param("id_cat_floor", "field (id_cat_floor) can not be empty").not().isEmpty(),
    param("id_cat_floor", "field (id_cat_floor) should be integer and greater than 0").isInt({ min: 1 }),
    param("id_cat_floor").custom(floorExistsById()),
    validateFields,
  ],
  floorGet,
);

router.put("/:id_cat_floor", 
  arrayValidatorAccess,
  [
    param("id_cat_floor", "field (id_cat_floor) can not be empty").not().isEmpty(),
    param("id_cat_floor", "field (id_cat_floor) should be integer and greater than 0").isInt({ min: 1 }),
    param("id_cat_floor").custom(floorExistsById(false)),
    check("number", "field (number) is required").not().isEmpty(),
    check("number", "field (number) should be integer and greater than 0").isInt({ min: 1 }),
    check("number", "field (number) should be greater than 0").isInt({ min: 1}),
    check("name", "field (name) is required").optional(),
    check("name").default(null),
    check("status", "field (status) is required").not().isEmpty(),
    check("status", "field (status) should be boolean").isBoolean(),
    validateFields,
  ],
  floorPut,
);

router.post("/", 
  arrayValidatorAccess,
  [
    check("number", "field (number) is required").not().isEmpty(),
    check("number", "field (number) should be integer and greater than 0").isInt({ min: 1 }),
    check("name", "field (name) is required").optional(),
    check("name").default(null),
    validateFields,
  ],
  floorPost,
);

router.delete("/:id_cat_floor", 
  arrayValidatorAccess,
  [
    param("id_cat_floor", "field (id_cat_floor) can not be empty").not().isEmpty(),
    param("id_cat_floor", "field (id_cat_floor) should be integer and greater than 0").isInt({ min: 1 }),
    param("id_cat_floor").custom(floorExistsById()),
    validateFields,
  ],
  floorDelete,
);

router.delete("/physical/:id_cat_floor", 
  arrayValidatorAccess,
  [
    param("id_cat_floor", "field (id_cat_floor) can not be empty").not().isEmpty(),
    param("id_cat_floor", "field (id_cat_floor) should be integer and greater than 0").isInt({ min: 1 }),
    param("id_cat_floor").custom(floorExistsById()),
    validateFields,
  ],
  floorDeletePhysical,
);


export default router;
