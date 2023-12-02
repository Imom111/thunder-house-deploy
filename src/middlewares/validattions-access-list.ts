
import { validateFields } from "./validate-fields";
import { validateJWT } from "./validate-jwt";
import { validateRoles } from "./validate-roles";

export const arrayValidatorAccess = [
  validateJWT,
  validateRoles,
  validateFields,
];
