import { UserModel } from "../models";
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: UserModel;
    }
  }
}