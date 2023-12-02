
import { Router } from "express";
import { check, param, query } from "express-validator";

import {
  employeeGetAll,
  employeeDelete,
  employeePost,
  employeePut,
  employeeGet,
} from "../../controllers/catalogs/employee.controllers";
import {
  validateFields,
} from "../../middlewares";
import {
  isUniqueUser,
  isValidArrayRoles,
  employeeExistsById,
} from "../../helpers/db-validators";
import { validateRealDate } from "../../helpers";
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
  employeeGetAll,
);

router.get("/:id_cat_employee", 
  arrayValidatorAccess,
  [
    param("id_cat_employee", "field (id_cat_employee) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_employee").custom(employeeExistsById()),
    validateFields,
  ],
  employeeGet,
);

router.put("/:id_cat_employee", 
  arrayValidatorAccess,
  [
    // employee
    param("id_cat_employee", "field (id_cat_employee) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_employee").custom(employeeExistsById(false)),
    // person
    check("name", "field(name) is required").not().isEmpty(),
    check("surname_father", "field(surname_father) is required").not().isEmpty(),
    check("surname_mother", "field(surname_mother) is required").not().isEmpty(),
    check("phone_contact", "field(phone_contact) is required").not().isEmpty(),
    check("email_contact", "field(email_contact) is required").not().isEmpty(),
    check("birth", "field(birth) is required").not().isEmpty(),
    check("birth", "field(birth) is required with this format yyyy-mm-dd").not().isEmpty().isISO8601().custom(validateRealDate),
    check("gender", "field(gender) is required").not().isEmpty(),
    check("street_address", "field(street_address) is required").not().isEmpty(),
    check("city", "field(city) is required").not().isEmpty(),
    check("state_province", "field(state_province) is required").not().isEmpty(),
    check("zip_code", "field(zip_code) is required").not().isEmpty(),
    check("country", "field(country) is required").not().isEmpty(),
    check("person_status", "field (person_status) is required").not().isEmpty(),
    check("person_status", "field (person_status) should be boolean").isBoolean(),
    // user
    check("email", "field (email) is required").not().isEmpty(),
    check("email").isEmail(),
    check('email').custom(isUniqueUser('email', true)),
    check("user_name", "field (user_name) is required").not().isEmpty(),
    check('user_name').custom(isUniqueUser('user_name', true)),
    check("password", "Password must be at least 6 characters long").optional().default(null).isLength({
      min: 6,
    }),
    check("password").default(null),
    check("user_status", "field (user_status) is required").not().isEmpty(),
    check("user_status", "field (user_status) should be boolean").isBoolean(),
    // role
    check("roles", "field (roles) is required").not().isEmpty(),
    check("roles", "field (roles) should be array").isArray(),
    check("roles").custom(isValidArrayRoles),
    validateFields,
  ],
  employeePut,
);

router.post("/", 
  arrayValidatorAccess,
  [
    // person
    check("name", "field(name) is required").not().isEmpty(),
    check("surname_father", "field(surname_father) is required").not().isEmpty(),
    check("surname_mother", "field(surname_mother) is required").not().isEmpty(),
    check("phone_contact", "field(phone_contact) is required").not().isEmpty(),
    check("email_contact", "field(email_contact) is required").not().isEmpty(),
    check("birth", "field(birth) is required").not().isEmpty(),
    check("birth", "field(birth) is required with this format yyyy-mm-dd").not().isEmpty().isISO8601().custom(validateRealDate),
    check("gender", "field(gender) is required").not().isEmpty(),
    check("street_address", "field(street_address) is required").not().isEmpty(),
    check("city", "field(city) is required").not().isEmpty(),
    check("state_province", "field(state_province) is required").not().isEmpty(),
    check("zip_code", "field(zip_code) is required").not().isEmpty(),
    check("country", "field(country) is required").not().isEmpty(),
    // user
    check("email", "email is required").not().isEmpty(),
    check("email").isEmail(),
    check('email').custom(isUniqueUser('email')),
    check("user_name", "user_name is required").not().isEmpty(),
    check('user_name').custom(isUniqueUser('user_name')),
    check("password", "Password is required").not().isEmpty(),
    check("password", "Password must be at least 6 characters long").isLength({
      min: 6,
    }),
    check("roles", "field (roles) is required").not().isEmpty(),
    check("roles", "field (roles) should be array").isArray(),
    check("roles").custom(isValidArrayRoles),
    validateFields,
  ],
  employeePost,
);

router.delete("/:id_cat_employee", 
  arrayValidatorAccess,
  [
    param("id_cat_employee", "field (id_cat_employee) can not be empty, should be integer, and greater than 0").not().isEmpty().isInt({ min: 1 }),
    param("id_cat_employee").custom(employeeExistsById()),
    validateFields,
  ],
  employeeDelete,
);

export default router;
