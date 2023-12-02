
import { Request, Response } from "express";

import {
  CatRoleEntity,
  CatUserEntity,
  DetailUserRoleEntity,
} from "../../entity";
import { generatePassword } from "../../helpers";
import { Equal } from "typeorm";


export const userGet = async (req: Request, res: Response) => {
  try {
    const { id_cat_user } = req.params;
    
    const userFound = await findExistingUser(parseInt(id_cat_user));
    const user: any = { ...userFound };
    delete user.password;
    
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const userGetAll = async (req: Request, res: Response) => {
  const { limit = 10, page = 1, pagination } = req.query;
  try {
    let usersList: CatUserEntity[] = [];
    if (pagination) {
      const parsedPage = parseInt(page as string, 10);
      const parsedLimit = parseInt(limit as string, 10);
      const skip = (parsedPage - 1) * parsedLimit;
      usersList = await CatUserEntity.createQueryBuilder('user')
        .leftJoinAndSelect('user.detail_user_role', 'detail_user_role')
        .leftJoinAndSelect('detail_user_role.cat_role', 'cat_role')
        .limit(parsedLimit)
        .offset(skip)
        .where('user.status = :status', { status: true })
        .getMany();
    } else {
      usersList = await CatUserEntity.createQueryBuilder('user')
        .leftJoinAndSelect('user.detail_user_role', 'detail_user_role')
        .leftJoinAndSelect('detail_user_role.cat_role', 'cat_role')
        .where('user.status = :status', { status: true })
        .getMany();
    }
    const listResult: any[] = usersList.map((user: CatUserEntity) => {
      const { password, ...rest } = user;
      return rest;
    });
    return res.status(200).json({
      list: listResult,
      count: listResult.length,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const userPut = async (req: Request, res: Response) => {
  const { id_cat_user } = req.params;
  const {
    password,
    email,
    user_name,
    roles,
    status,
  }: {
    password: string,
    email: string,
    user_name: string,
    roles: {id_role: string}[],
    status: boolean,
  } = req.body;
  try {
    const userUpdating = await CatUserEntity.findOne({
      where: {
        id_cat_user: parseInt(id_cat_user),
      },
    });
    
    userUpdating!.password = generatePassword(password);
    userUpdating!.email = email;
    userUpdating!.user_name = user_name;
    userUpdating!.status = status;
    userUpdating!.save();
    const foundDetailUserRoleEntity = await DetailUserRoleEntity.findBy({
      cat_user: !userUpdating
    });
    for (const item of foundDetailUserRoleEntity) {
      await item.remove();
    }
    for (const role of roles) {
      const newDetailUserRoleEntity = new DetailUserRoleEntity();
      const roleFound = await CatRoleEntity.findOne({
        where: {
          id_cat_role: parseInt(role.id_role),
          status: true,
        },
      });
      newDetailUserRoleEntity.cat_role = roleFound!;
      newDetailUserRoleEntity.cat_user = userUpdating!;
      await newDetailUserRoleEntity.save();
    }

    const userFound = await findExistingUser(userUpdating!.id_cat_user!);

    const user: any = { ...userFound };
    delete user.password;
    
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const userPost = async (req: Request, res: Response) => {
  const {
    password,
    email,
    user_name,
    roles,
  }: {
    password: string,
    email: string,
    user_name: string,
    roles: {id_role: string}[],
  } = req.body;
  try {
    const newUser: CatUserEntity = new CatUserEntity();
    newUser.email = email;
    newUser.user_name = user_name;
    newUser.password = generatePassword(password);
    await newUser.save();
    for (const role of roles) {
      const newDetailUserRoleEntity = new DetailUserRoleEntity();
      const roleFound = await CatRoleEntity.findOne({
        where: {
          id_cat_role: parseInt(role.id_role),
          status: true,
        },
      });
      newDetailUserRoleEntity.cat_role = roleFound!;
      newDetailUserRoleEntity.cat_user = newUser;
      await newDetailUserRoleEntity.save();
    }
    const userFound = await findExistingUser(newUser.id_cat_user!);
    const user: any = { ...userFound };
    delete user.password;
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const userDelete = async (req: Request, res: Response) => {
  const { id_cat_user } = req.params;
  try {
    const userFound = await CatUserEntity.findOne({
      where: {
        id_cat_user: parseInt(id_cat_user),
      },
    });
    userFound!.status = false;
    await userFound!.save();
    const user: any = { ...userFound };
    delete user.password;
    return res.status(200).json({
      msg: 'Logically deleted user',
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const userDeletePhysical = async (req: Request, res: Response) => {
  const { id_cat_user } = req.params;
  try {
    const userFound = await CatUserEntity.findOne({
      where: {
        id_cat_user: parseInt(id_cat_user),
      },
    });
    const foundDetailUserRoleEntity = await DetailUserRoleEntity.find({
      where: {
        cat_user: Equal(userFound!.id_cat_user)
      }
    });
    for (const item of foundDetailUserRoleEntity) {
      await item.remove();
    }
    await userFound!.remove();

    const user: any = { ...userFound };
    delete user.password;
    
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};


export const findExistingUser = async (id_cat_user: number): Promise<CatUserEntity> => {
  const userFound: CatUserEntity | null = await CatUserEntity.createQueryBuilder('user')
    .leftJoinAndSelect('user.detail_user_role', 'detail_user_role')
    .leftJoinAndSelect('detail_user_role.cat_role', 'cat_role')
    .where('user.id_cat_user = :id_cat_user AND user.status = :status', { id_cat_user, status: true })
    .getOne();
  return userFound!;
};
