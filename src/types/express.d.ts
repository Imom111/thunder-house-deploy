
import { Request } from "express";

import { UserEntity } from "../models";


declare global {
  namespace Express {
    interface Request {
      user?: UserEntity;
    }
  }
}
