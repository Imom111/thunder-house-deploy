
import { Router } from "express";
import { check, param, query } from "express-validator";

import {
  validateFields,
} from "../../middlewares";
import {
  floorExistsById,
  roomExistsById,
  roomStatusExistsById,
  roomTypeExistsById,
} from "../../helpers/db-validators";
import {
  changeRoomStatus,
  getBusyDatesByDate,
  getBusyRooms,
  getRoomsAvailability,
  getRoomsByFloor,
} from "../../controllers/actions/room.actions.controllers";
import { validateRealDate } from "../../helpers";
import { arrayValidatorAccess } from "../../middlewares/validattions-access-list";


const router = Router();

router.put("/change-room-status/:id_cat_room", 
  arrayValidatorAccess,
  [
    param("id_cat_room", "field (id_cat_room) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_room").custom(roomExistsById()),
    check("id_cat_room_status", "field (id_cat_room_status) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    check("id_cat_room_status", "field (id_cat_room_status) "),
    check("id_cat_room_status").custom(roomStatusExistsById()),
    validateFields,
  ],
  changeRoomStatus,
);

router.get("/get-by-floor/:id_cat_floor", 
  arrayValidatorAccess,
  [
    param("id_cat_floor", "field (id_cat_floor) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_floor").custom(floorExistsById()),
    validateFields,
  ],
  getRoomsByFloor,
);

router.get("/get-availability-rooms", 
  arrayValidatorAccess,
  getRoomsAvailability,
);

router.get("/get-busy-rooms", 
  arrayValidatorAccess,
  [
    query("id_cat_room_type", "field (id_cat_room_type) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    query("start_date", "field(start_date) is required").not().isEmpty(),
    query("start_date", "field(start_date) is required with this format yyyy-mm-dd").not().isEmpty().isISO8601().custom(validateRealDate),
    query("end_date", "field(end_date) is required").not().isEmpty(),
    query("end_date", "field(end_date) is required with this format yyyy-mm-dd").not().isEmpty().isISO8601().custom(validateRealDate),
    validateFields,
    query("id_cat_room_type").custom(roomTypeExistsById()),
    validateFields,
  ],
  getBusyRooms,
);


router.get("/get-busy-dates-by-date", 
  arrayValidatorAccess,
  [
    query("start_date", "field(start_date) is required").not().isEmpty(),
    query("start_date", "field(start_date) is required with this format yyyy-mm-dd").not().isEmpty().isISO8601().custom(validateRealDate),
    query("end_date", "field(end_date) is required").not().isEmpty(),
    query("end_date", "field(end_date) is required with this format yyyy-mm-dd").not().isEmpty().isISO8601().custom(validateRealDate),
    validateFields,
  ],
  getBusyDatesByDate,
);

export default router;
