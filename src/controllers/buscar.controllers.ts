
import { Request, Response } from "express";
import { getMetadataArgsStorage } from 'typeorm';

import { CatUserEntity } from "../entity";

// const allowedCollections = getMetadataArgsStorage().tables.map((table) => table.targetName);

// const buscarUsuarios = async (term = "", res: Response) => {
//   const isUUID = true;
//   if (isUUID) {
//     const user = await UserEntity.findByPk(term);
//     return res.json({
//       results: user ? [user] : [],
//     });
//   }

//   const regex = new RegExp(term, "i");
//   const users: UserEntity[] = await UserEntity.findAll({
//     where: {
//       status: true,
//       [Op.or]: [
//         { user_name: { [Op.regexp]: term } },
//         { email: { [Op.regexp]: term } },
//       ],
//     },
//   });
//   return res.json({
//     results: users,
//   });
// };

// export const buscar = (req: Request, res: Response) => {
//   const { collection, term } = req.params;

//   if (!allowedCollections.includes(collection)) {
//     return res.status(400).json({
//       msg: `Allowed collections are ${allowedCollections.join(", ")}`,
//     });
//   }

//   switch (collection) {
//     case "users":
//       buscarUsuarios(term, res);
//       break;
//     default:
//       res.status(500).json({
//         msg: "Server error",
//       });
//       break;
//   }
// };
