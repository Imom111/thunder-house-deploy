
import { Router } from "express";
import { check, param, query } from "express-validator";

import {
  roomGetAll,
  roomDelete,
  roomPost,
  roomPut,
  roomGet,
  roomDeletePhysical,
} from "../../controllers/catalogs/room.controllers";
import {
  validateFields,
} from "../../middlewares";
import {
  floorExistsById,
  roomExistsById,
  roomStatusExistsById,
  roomTypeExistsById,
} from "../../helpers/db-validators";
import { arrayValidatorAccess } from "../../middlewares/validattions-access-list";


const router = Router();

router.get("/", 
  arrayValidatorAccess,
  [
    query("limit", "field (limit) should be integer, and greater than 0").isInt({ min: 1 }).optional().default(null),
    query("page", "field (page) should be integer, and greater than 0").isInt({ min: 1 }).optional().default(null),
    query("pagination", "field (pagination) should be boolean").isBoolean().optional().default(false),
    validateFields,
  ],
  roomGetAll,
);

router.get("/:id_cat_room", 
  arrayValidatorAccess,
  [
    param("id_cat_room", "field (id_cat_room) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_room").custom(roomExistsById()),
    validateFields,
  ],
  roomGet,
);

router.put("/:id_cat_room", 
  arrayValidatorAccess,
  [
    param("id_cat_room", "field (id_cat_room) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_room").custom(roomExistsById(false)),
    check("number", "field (number) is required, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    check("name", "field (name) is required").optional(),
    check("name").default(null),
    check("status", "field (status) is required").not().isEmpty(),
    check("status", "field (status) should be boolean").isBoolean(),
    check("fk_cat_floor", "field (fk_cat_floor) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    check("fk_cat_floor").custom(floorExistsById()),
    check("fk_cat_room_status", "field (fk_cat_room_status) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    check("fk_cat_room_status").custom(roomStatusExistsById()),
    check("fk_cat_room_type", "field (fk_cat_room_type) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    check("fk_cat_room_type").custom(roomTypeExistsById()),
    validateFields,
  ],
  roomPut,
);

router.post("/", 
  arrayValidatorAccess,
  [
    check("number", "field (number) is required, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    check("name", "field (name) is required").optional(),
    check("name").default(null),
    check("fk_cat_floor", "field (fk_cat_floor) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    check("fk_cat_floor").custom(floorExistsById()),
    check("fk_cat_room_status", "field (fk_cat_room_status) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    check("fk_cat_room_status").custom(roomStatusExistsById()),
    check("fk_cat_room_type", "field (fk_cat_room_type) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    check("fk_cat_room_type").custom(roomTypeExistsById()),
    validateFields,
  ],
  roomPost,
);

router.delete("/:id_cat_room", 
  arrayValidatorAccess,
  [
    param("id_cat_room", "field (id_cat_room) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_room").custom(roomExistsById()),
    validateFields,
  ],
  roomDelete,
);

router.delete("/physical/:id_cat_room", 
  arrayValidatorAccess,
  [
    param("id_cat_room", "field (id_cat_room) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_room").custom(roomExistsById()),
    validateFields,
  ],
  roomDeletePhysical,
);

export default router;
