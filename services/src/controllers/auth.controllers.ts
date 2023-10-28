
import { Request, Response } from "express";
import bcryptjs from "bcryptjs";

import { CatUserEntity } from "../entity";
import { generateJWT } from "../helpers/generate-jwt";


export const login = async (req: Request, res: Response) => {
  const { credential, password } = req.body;
  try {
    const user = await CatUserEntity.findOne({
      where: [
        { user_name: credential },
        { email: credential },
      ]
    });
    // TODO Validate { status: true },
    if (!user) {
      return res.status(400).json({
        msg: "user_name or password is incorrect - email",
      });
    }
    if (!user.status) {
      return res.status(400).json({
        msg: "user_name or password is incorrect - status: false",
      });
    }
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "user_name or password is incorrect - password",
      });
    }
    const token = await generateJWT(user.id_cat_user!.toString());
    return res.json({
      credential,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Contact the system administrator",
    });
  }
};
