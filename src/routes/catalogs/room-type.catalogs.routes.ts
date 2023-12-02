
import { Router } from "express";
import { check, param, query } from "express-validator";

import {
  roomTypeGetAll,
  roomTypeDelete,
  roomTypePost,
  roomTypePut,
  roomTypeGet,
  roomTypeDeletePhysical,
} from "../../controllers/catalogs/room-type.controllers";
import {
  validateFields,
} from "../../middlewares";
import {
  roomTypeExistsById,
  isValidArraySupplies,
  isValidArrayEquipments,
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
  roomTypeGetAll,
);

router.get("/:id_cat_room_type", 
  arrayValidatorAccess,
  [
    param("id_cat_room_type", "field (id_cat_room_type) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_room_type").custom(roomTypeExistsById()),
    validateFields,
  ],
  roomTypeGet,
);

router.put("/:id_cat_room_type", 
  arrayValidatorAccess,
  [
    param("id_cat_room_type", "field (id_cat_room_type) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_room_type").custom(roomTypeExistsById(false)),
    check("room_type", "field (room_type) is required").not().isEmpty(),
    check("price", "field (price) is required and should be number").not().isEmpty().isNumeric(),
    check("supplies", "field (supplies) is required").not().isEmpty(),
    check("supplies", "field (supplies) should be array").isArray(),
    check("supplies").custom(isValidArraySupplies),
    check("equipments", "field (equipments) is required").not().isEmpty(),
    check("equipments", "field (equipments) should be array").isArray(),
    check("equipments").custom(isValidArrayEquipments),
    check("status", "field (status) is required").not().isEmpty(),
    check("status", "field (status) should be boolean").isBoolean(),
    validateFields,
  ],
  roomTypePut,
);

router.post("/", 
  arrayValidatorAccess,
  [
    check("room_type", "field (room_type) is required").not().isEmpty(),
    check("price", "field (price) is required and should be number").not().isEmpty().isNumeric(),
    check("supplies", "field (supplies) is required").not().isEmpty(),
    check("supplies", "field (supplies) should be array").isArray(),
    check("supplies").custom(isValidArraySupplies),
    check("equipments", "field (equipments) is required").not().isEmpty(),
    check("equipments", "field (equipments) should be array").isArray(),
    check("equipments").custom(isValidArrayEquipments),
    validateFields,
  ],
  roomTypePost,
);

router.delete("/:id_cat_room_type", 
  arrayValidatorAccess,
  [
    param("id_cat_room_type", "field (id_cat_room_type) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_room_type").custom(roomTypeExistsById()),
    validateFields,
  ],
  roomTypeDelete,
);

router.delete("/physical/:id_cat_room_type", 
  arrayValidatorAccess,
  [
    param("id_cat_room_type", "field (id_cat_room_type) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_room_type").custom(roomTypeExistsById()),
    validateFields,
  ],
  roomTypeDeletePhysical,
);

export default router;
