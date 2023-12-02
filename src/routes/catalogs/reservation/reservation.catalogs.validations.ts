import { check } from 'express-validator';
import { validateFields } from '../../../middlewares';

export const valStrucutrePostReservation = [
  check('group_leader')
    .notEmpty()
    .withMessage('field (group_leader) is required'),

  check('sub_group_leader')
    .notEmpty()
    .withMessage('field (sub_group_leader) is required'),

  check('is_from_platform_promotion')
    .notEmpty()
    .withMessage('field (is_from_platform_promotion) is required')
    .isBoolean()
    .withMessage('is_from_platform_promotion should be boolean'),

  check('fk_cat_client')
    .notEmpty()
    .withMessage('field (fk_cat_client) is required')
    .isInt({ min: 1 })
    .withMessage('fk_cat_client should be integer, and greater than 0'),

  check('detail_reservation_room.*.fk_cat_room')
    .notEmpty()
    .withMessage('fk_cat_room cannot be empty')
    .isInt({ min: 1 })
    .withMessage('fk_cat_room should be integer and greater than 0'),

  check('detail_reservation_room.*.total_people_booked')
    .notEmpty()
    .withMessage('total_people_booked cannot be empty')
    .isInt({ min: 1 })
    .withMessage('total_people_booked should be integer and greater than 0'),

  check('start_date')
    .notEmpty()
    .withMessage('start_date is required')
    .isISO8601()
    .withMessage('start_date is required with this format yyyy-mm-dd'),

  check('end_date')
    .notEmpty()
    .withMessage('end_date is required')
    .isISO8601()
    .withMessage('end_date is required with this format yyyy-mm-dd'),

  check('has_breakfast')
    .notEmpty()
    .withMessage('has_breakfast cannot be empty')
    .isBoolean()
    .withMessage('has_breakfast should be a boolean'),

  validateFields,
];
