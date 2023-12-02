
import { NextFunction, Request, Response } from "express";


export const validateRoles = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next();
  // const token = req.header("token");
  // if (!token) {
  //   return res.status(401).json({
  //     msg: "No token received",
  //   });
  // }
  // try {
  //   next();
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json({ msg: "Internal server error" });
  // }
};
