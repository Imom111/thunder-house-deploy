import { param, check } from "express-validator";
import { validateFields } from "../../../middlewares";
import { reservationExistsById } from "../../../helpers";

export const valStrucutrePutRegisterArrive = [
  param('id_cat_reservation')
    .notEmpty()
    .withMessage('field (id_cat_reservation) cannot be empty, must be integer, and greater than 0')
    .isInt({ min: 1 })
    .withMessage('id_cat_reservation must be an integer greater than 0'),

  check('detail_reservation_room.*.id_detail_reservation_room')
    .notEmpty()
    .withMessage('id_detail_reservation_room cannot be empty')
    .isInt({ min: 1 })
    .withMessage('id_detail_reservation_room must be an integer and greater than 0'),

  check('detail_reservation_room.*.total_people_arrived')
    .notEmpty()
    .withMessage('total_people_arrived cannot be empty')
    .isInt({ min: 1 })
    .withMessage('total_people_arrived must be an integer and greater than 0'),

  check('detail_reservation_room.*.extra_parking_pass')
    .isInt({ min: 0 })
    .withMessage('extra_parking_pass must be an integer and greater than or equal to 0'),

  check('detail_reservation_room.*.parking_pass_delivered')
    .notEmpty()
    .withMessage('parking_pass_delivered cannot be empty')
    .isBoolean()
    .withMessage('parking_pass_delivered must be a boolean'),

  check('detail_reservation_room.*.key_delivered')
    .notEmpty()
    .withMessage('key_delivered cannot be empty')
    .isBoolean()
    .withMessage('key_delivered must be a boolean'),

  check('detail_reservation_room.*.baggage_claim')
    .notEmpty()
    .withMessage('baggage_claim cannot be empty')
    .isBoolean()
    .withMessage('baggage_claim must be a boolean'),

  check('detail_reservation_room.*.supplies_delivered')
    .notEmpty()
    .withMessage('supplies_delivered cannot be empty')
    .isBoolean()
    .withMessage('supplies_delivered must be a boolean'),
  
  validateFields,
];

export const valStructurePutRegisterOutput = [
  param('id_cat_reservation')
    .notEmpty()
    .withMessage('field (id_cat_reservation) cannot be empty')
    .isInt({ min: 1 })
    .withMessage('id_cat_reservation must be an integer greater than 0'),

  check('detail_reservation_room.*.id_detail_reservation_room')
    .notEmpty()
    .withMessage('id_detail_reservation_room cannot be empty')
    .isInt({ min: 1 })
    .withMessage('id_detail_reservation_room must be an integer and greater than 0'),

  check('detail_reservation_room.*.extra_parking_pass_returned')
    .notEmpty()
    .withMessage('extra_parking_pass_returned cannot be empty')
    .isInt({ min: 0 })
    .withMessage('extra_parking_pass_returned must be an integer and greater than or equal to 0'),

  check('detail_reservation_room.*.parking_pass_returned')
    .notEmpty()
    .withMessage('detail_reservation_room cannot be empty')
    .isBoolean()
    .withMessage('parking_pass_returned must be a boolean'),

  check('detail_reservation_room.*.parking_pass_forgot')
    .notEmpty()
    .withMessage('parking_pass_forgot cannot be empty')
    .isBoolean()
    .withMessage('parking_pass_forgot must be a boolean'),

  check('detail_reservation_room.*.key_returned')
    .notEmpty()
    .withMessage('key_returned cannot be empty')
    .isBoolean()
    .withMessage('key_returned must be a boolean'),

  check('detail_reservation_room.*.key_forgot')
    .notEmpty()
    .withMessage('key_forgot cannot be empty')
    .isBoolean()
    .withMessage('key_forgot must be a boolean'),

  check('detail_reservation_room.*.observations')
    .optional({ nullable: true })
    .isString().withMessage('observations must be a string')
    .not().isEmpty().withMessage('observations cannot be empty'),

  check('detail_reservation_room.*.extra_charges')
    .optional({ nullable: true })
    .isNumeric()
    .withMessage('extra_charges must be a number'),

  validateFields,
];


export const valDatabasePut = [
  param("id_cat_reservation").custom(reservationExistsById),
  validateFields,
];
