
import { Router } from "express";
import { check, param, query } from "express-validator";

import {
  reservationGetAll,
  reservationPost,
  reservationPut,
  reservationGet,
} from "../../../controllers/catalogs/reservation.controllers";
import {
  validateFields,
} from "../../../middlewares";
import {
  clientExistsById,
  reservationExistsById,
} from "../../../helpers/db-validators";
import { arrayValidatorAccess } from "../../../middlewares/validattions-access-list";
import {
  valStrucutrePostReservation,
} from "./reservation.catalogs.validations";
import { validateExistingArrayRooms } from "../../../helpers";


const router = Router();

router.get("/", 
  arrayValidatorAccess,
  [
    query("limit", "field (limit) should be integer and greater than 0").isInt({ min: 1 }).optional().default(null),
    query("page", "field (page) should be integer and greater than 0").isInt({ min: 1 }).optional().default(null),
    query("pagination", "field (pagination) should be boolean").isBoolean().optional().default(false),
    validateFields,
  ],
  reservationGetAll,
);

router.get("/:id_cat_reservation", 
  arrayValidatorAccess,
  [
    param("id_cat_reservation", "field (id_cat_reservation) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_reservation").custom(reservationExistsById),
    validateFields,
  ],
  reservationGet,
);

router.put("/:id_cat_reservation", 
  // arrayValidatorAccess,
  // [
  //   param("id_cat_reservation", "field (id_cat_reservation) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
//     param("id_cat_reservation").custom(reservationExistsById),
//     check("group_leader", "field (group_leader) is required").not().isEmpty(),
//     check("sub_group_leader", "field (sub_group_leader) is required").not().isEmpty(),
//     check("is_from_platform_promotion", "field (is_from_platform_promotion) is required and should be boolean").not().isEmpty().isBoolean(),
//     check("fk_cat_client", "field (fk_cat_client) is required, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
//     check("status", "field (status) is required").not().isEmpty(),
//     check("status", "field (status) should be boolean").isBoolean(),
//     validateFields,
//   ],
  reservationPut,
);

router.post("/",
  arrayValidatorAccess,
  valStrucutrePostReservation,
  [
    check("fk_cat_client").custom(clientExistsById()),
    validateFields,
    check("detail_reservation_room").custom(validateExistingArrayRooms),
    validateFields,
  ],
  reservationPost,
);


export default router;
