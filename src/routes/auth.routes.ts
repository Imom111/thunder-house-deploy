
import express from "express";
import { check } from "express-validator";

import { login } from "../controllers/auth.controllers";
import { validateFields } from "../middlewares/validate-fields";


const router = express.Router();

router.post("/login", [
    check("credential", "field (credential) is required: user_name or email").not().isEmpty(),
    check("password", "field (password) is required").not().isEmpty(),
    validateFields,
  ],
  login,
);

export default router;
