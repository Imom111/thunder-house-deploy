
import { Router } from "express";
import { check, param } from "express-validator";

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
  validateJWT,
} from "../../middlewares";
import {
  roomTypeExistsById,
  isValidArraySupplies,
  isValidArrayEquipments,
} from "../../helpers/db-validators";
import { validateRoles } from "../../middlewares/validate-roles";


const router = Router();

// GET route for fetching roomType data
router.get("/", [
    validateJWT,
    validateRoles,
    validateFields,
  ],
  roomTypeGetAll,
);

router.get("/:id_cat_room_type", [
    validateJWT,
    validateRoles,
    validateFields,
    param("id_cat_room_type", "field (id_cat_room_type) can not be empty").not().isEmpty(),
    param("id_cat_room_type", "field (id_cat_room_type) should be integer").isInt({ min: 1 }),
    param("id_cat_room_type").custom(roomTypeExistsById()),
    validateFields,
  ],
  roomTypeGet,
);

// PUT route for updating a roomType's data by ID
router.put("/:id_cat_room_type", [
    validateJWT,
    validateRoles,
    validateFields,
    param("id_cat_room_type", "field (id_cat_room_type) can not be empty").not().isEmpty(),
    param("id_cat_room_type", "field (id_cat_room_type) should be integer").isInt({ min: 1 }),
    param("id_cat_room_type").custom(roomTypeExistsById(false)),
    check("room_type", "field (room_type) is required").not().isEmpty(),
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

// POST route for creating a new roomType
router.post("/", [
    validateJWT,
    validateRoles,
    validateFields,
    check("room_type", "field (room_type) is required").not().isEmpty(),
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

// DELETE route for deleting a roomType by ID
router.delete("/:id_cat_room_type", [
    validateJWT,
    validateRoles,
    validateFields,
    param("id_cat_room_type", "field (id_cat_room_type) can not be empty").not().isEmpty(),
    param("id_cat_room_type", "field (id_cat_room_type) should be integer").isInt({ min: 1 }),
    param("id_cat_room_type").custom(roomTypeExistsById()),
    validateFields,
  ],
  roomTypeDelete,
);

// DELETE route for deleting a roomType by ID
router.delete("/physical/:id_cat_room_type", [
    validateJWT,
    validateRoles,
    validateFields,
    param("id_cat_room_type", "field (id_cat_room_type) can not be empty").not().isEmpty(),
    param("id_cat_room_type", "field (id_cat_room_type) should be integer").isInt({ min: 1 }),
    param("id_cat_room_type").custom(roomTypeExistsById()),
    validateFields,
  ],
  roomTypeDeletePhysical,
);

export default router;
