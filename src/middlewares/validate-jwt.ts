
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from "jsonwebtoken";

import { CatUserEntity } from '../entity';
import { ENV_SECRET_OR_PRIVATE_KEY } from '../config/enviroment';


export const validateJWT = async( req: Request ,res: Response, next: NextFunction ) => {
  // const token = req.header("token");
  // if (!token) {
  //   return res.status(401).json({
  //     msg: "No token received",
  //   });
  // }
  try {
  //   const { uid: id_cat_user } = jwt.verify(
  //     token,
  //     ENV_SECRET_OR_PRIVATE_KEY,
  //   ) as JwtPayload;
  //   const user = await CatUserEntity.findOne({
  //     where: {
  //       id_cat_user,
  //       status: true,
  //     },
  //   });
  //   if (!user) {
  //     return res.status(401).json({
  //       msg: "Invalid token - User not found",
  //     });
  //   }
  //   if (!user.status) {
  //     return res.status(401).json({
  //       msg: "Invalid token - User status: false",
  //     });
  //   }
  //   req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Invalid token",
    });
  }
};
