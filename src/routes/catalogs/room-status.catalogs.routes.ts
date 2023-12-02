
import { Router } from "express";
import { check, param, query } from "express-validator";

import {
  roomStatusGetAll,
  roomStatusDelete,
  roomStatusPost,
  roomStatusPut,
  roomStatusGet,
  roomStatusDeletePhysical,
} from "../../controllers/catalogs/room-status.controllers";
import {
  validateFields,
} from "../../middlewares";
import {
  roomStatusExistsById,
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
  roomStatusGetAll,
);

router.get("/:id_cat_room_status", 
  arrayValidatorAccess,
  [
    param("id_cat_room_status", "field (id_cat_room_status) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_room_status").custom(roomStatusExistsById()),
    validateFields,
  ],
  roomStatusGet,
);

router.put("/:id_cat_room_status", 
  arrayValidatorAccess,
  [
    param("id_cat_room_status", "field (id_cat_room_status) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_room_status").custom(roomStatusExistsById(false)),
    check("dirty", "field (dirty) is required").not().isEmpty(),
    check("dirty", "field (dirty) should be boolean").isBoolean(),
    check("busy", "field (busy) is required").not().isEmpty(),
    check("busy", "field (busy) should be boolean").isBoolean(),
    check("status", "field (status) is required").not().isEmpty(),
    check("status", "field (status) should be boolean").isBoolean(),
    validateFields,
  ],
  roomStatusPut,
);

router.post("/", 
  arrayValidatorAccess,
  [
    check("dirty", "field (dirty) is required").not().isEmpty(),
    check("dirty", "field (dirty) should be boolean").isBoolean(),
    check("busy", "field (busy) is required").not().isEmpty(),
    check("busy", "field (busy) should be boolean").isBoolean(),
    validateFields,
  ],
  roomStatusPost,
);

router.delete("/:id_cat_room_status", 
  arrayValidatorAccess,
  [
    param("id_cat_room_status", "field (id_cat_room_status) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_room_status").custom(roomStatusExistsById()),
    validateFields,
  ],
  roomStatusDelete,
);

router.delete("/physical/:id_cat_room_status", 
  arrayValidatorAccess,
  [
    param("id_cat_room_status", "field (id_cat_room_status) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_room_status").custom(roomStatusExistsById()),
    validateFields,
  ],
  roomStatusDeletePhysical,
);

export default router;
