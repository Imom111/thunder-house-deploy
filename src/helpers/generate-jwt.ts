
import jwt from "jsonwebtoken";
import { ENV_SECRET_OR_PRIVATE_KEY } from "../config/enviroment";
import { CatClientEntity, CatEmployeeEntity, CatUserEntity } from "../entity";

const generateJWT = (payload: any) => {
  return new Promise((resolve, reject) => {
    const secretKey: string = ENV_SECRET_OR_PRIVATE_KEY;
    if (secretKey !== "") {
      jwt.sign(
        payload,
        secretKey,
        {
          expiresIn: "2d",
        },
        (err: Error | null, token) => {
          if (err) {
            console.log(err);
            reject("Unable to generate the token");
          } else if (token) {
            resolve(token);
          } else {
            reject("Token is null or undefined");
          }
        },
      );
    } else {
      reject("Secret key not detected");
    }
  });
};

const fillPayload = async (id_cat_user: number) => {
  const employeeFound = await CatEmployeeEntity.findOne({
    where: {
      cat_user: {
        id_cat_user
      }
    }
  });
  const clientFound = await CatClientEntity.findOne({
    where: {
      cat_user: {
        id_cat_user
      }
    }
  });
  if (clientFound) {
    const userWithRolesAndFloors = await CatUserEntity
      .createQueryBuilder('cu')
      .where('cu.id_cat_user = :id_cat_user', { id_cat_user })
      .andWhere('cu.status = :status', { status: true })
      .getOne();
    if (!userWithRolesAndFloors) {
      throw 'User without person';
    }
    const transformedResult = {
      id_cat_user: userWithRolesAndFloors.id_cat_user,
      email: userWithRolesAndFloors.email,
      user_name: userWithRolesAndFloors.user_name,
    };
    return transformedResult;
  }
  
  if (employeeFound) {
    const userWithRolesAndFloors = await CatUserEntity
      .createQueryBuilder('cu')
      .leftJoinAndSelect('cu.detail_user_role', 'dur')
      .leftJoinAndSelect('dur.cat_role', 'cr')
      .leftJoinAndSelect('cr.detail_role_floor', 'drf')
      .leftJoinAndSelect('drf.cat_floor', 'cf')
      .where('cu.id_cat_user = :id_cat_user', { id_cat_user })
      .andWhere('cu.status = :status', { status: true })
      .andWhere('cr.status = :status', { status: true })
      .andWhere('cf.status = :status', { status: true })
      .getOne();
    if (!userWithRolesAndFloors) {
      throw 'User without person';
    }
    const transformedResult = {
      id_cat_user: userWithRolesAndFloors.id_cat_user,
      email: userWithRolesAndFloors.email,
      user_name: userWithRolesAndFloors.user_name,
      roles: userWithRolesAndFloors.detail_user_role.map(dur => ({
        id_detail_user_role: dur.id_detail_user_role,
        role: dur.cat_role.role,
        floors: dur.cat_role.detail_role_floor.map(drf => ({
          id_cat_floor: drf.cat_floor.id_cat_floor,
          number: drf.cat_floor.number,
          name: drf.cat_floor.name
        }))
      }))
    };
    return transformedResult;
  }
  throw 'User without person';
};

export const getToken = async (id_cat_user: number) => {
  const payload = await fillPayload(id_cat_user);
  const token = await generateJWT(payload);
  return token;
}
