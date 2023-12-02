
import { Router } from "express";
import { check, param, query } from "express-validator";

import {
  supplieGetAll,
  supplieDelete,
  suppliePost,
  suppliePut,
  supplieGet,
  supplieDeletePhysical,
} from "../../controllers/catalogs/supplie.controllers";
import {
  validateFields,
} from "../../middlewares";
import {
  supplieExistsById,
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
  supplieGetAll,
);

router.get("/:id_cat_supplie", 
  arrayValidatorAccess,
  [
    param("id_cat_supplie", "field (id_cat_supplie) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_supplie").custom(supplieExistsById()),
    validateFields,
  ],
  supplieGet,
);

router.put("/:id_cat_supplie", 
  arrayValidatorAccess,
  [
    param("id_cat_supplie", "field (id_cat_supplie) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_supplie").custom(supplieExistsById(false)),
    check("supplie", "field (supplie) is required").not().isEmpty(),
    check("status", "field (status) is required").not().isEmpty(),
    check("status", "field (status) should be boolean").isBoolean(),
    validateFields,
  ],
  suppliePut,
);

router.post("/", 
  arrayValidatorAccess,
  [
    check("supplie", "field (supplie) is required").not().isEmpty(),
    validateFields,
  ],
  suppliePost,
);

router.delete("/:id_cat_supplie", 
  arrayValidatorAccess,
  [
    param("id_cat_supplie", "field (id_cat_supplie) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_supplie").custom(supplieExistsById()),
    validateFields,
  ],
  supplieDelete,
);

router.delete("/physical/:id_cat_supplie", 
  arrayValidatorAccess,
  [
    param("id_cat_supplie", "field (id_cat_supplie) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_supplie").custom(supplieExistsById()),
    validateFields,
  ],
  supplieDeletePhysical,
);

export default router;
