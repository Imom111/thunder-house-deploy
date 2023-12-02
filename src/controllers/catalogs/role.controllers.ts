
import { Request, Response } from "express";

import {
  CatFloorEntity,
  CatRoleEntity,
  DetailRoleFloorEntity,
  DetailUserRoleEntity,
} from "../../entity";
import { Equal, FindOperator } from "typeorm";


export const roleGet = async (req: Request, res: Response) => {
  try {
    const { id_cat_role } = req.params;
    const roleFound = await findExistingRole(parseInt(id_cat_role));
    return res.status(200).json({
      role: roleFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const roleGetAll = async (req: Request, res: Response) => {
  const { limit = 10, page = 1, pagination } = req.query;
  try {
    let rolesList: CatRoleEntity[] = [];
    if (pagination) {
      const parsedPage = parseInt(page as string, 10);
      const parsedLimit = parseInt(limit as string, 10);
      const skip = (parsedPage - 1) * parsedLimit;
      rolesList = await CatRoleEntity.createQueryBuilder('role')
        .leftJoinAndSelect('role.detail_role_floor', 'detail_role_floor')
        .leftJoinAndSelect('detail_role_floor.cat_floor', 'cat_floor')
        .limit(parsedLimit)
        .offset(skip)
        .where('role.status = :status', { status: true })
        .getMany();
    } else {
      rolesList = await CatRoleEntity.createQueryBuilder('role')
        .leftJoinAndSelect('role.detail_role_floor', 'detail_role_floor')
        .leftJoinAndSelect('detail_role_floor.cat_floor', 'cat_floor')
        .where('role.status = :status', { status: true })
        .getMany();
    }
    return res.status(200).json({
      list: rolesList,
      count: rolesList.length,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const rolePut = async (req: Request, res: Response) => {
  const { id_cat_role } = req.params;
  const {
    role,
    floors,
    status,
  }: {
    role: string,
    floors: {id_floor: string}[],
    status: boolean,
  } = req.body;
  try {
    const roleUpdating = await CatRoleEntity.findOne({
      where: {
        id_cat_role: parseInt(id_cat_role),
      },
    });
    roleUpdating!.role = role;
    roleUpdating!.status = status;
    await roleUpdating!.save();
    const foundDetailRoleFloorEntity = await DetailRoleFloorEntity.find({
      where: {
        cat_role: Equal(roleUpdating!.id_cat_role)
      }
    });
    for (const item of foundDetailRoleFloorEntity) {
      await item.remove();
    }
    for (const floor of floors) {
      const newDetailRoleFloorEntity = new DetailRoleFloorEntity();
      const floorFound = await CatFloorEntity.findOne({
        where: {
          id_cat_floor: parseInt(floor.id_floor),
          status: true,
        },
      });
      newDetailRoleFloorEntity.cat_role = roleUpdating!;
      newDetailRoleFloorEntity.cat_floor = floorFound!;
      await newDetailRoleFloorEntity.save();
    }
    
    const roleFound = await findExistingRole(roleUpdating!.id_cat_role!);

    return res.status(200).json({
      role: roleFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const rolePost = async (req: Request, res: Response) => {
  const {
    role,
    floors,
  }: {
    role: string,
    floors: {id_floor: number}[],
  } = req.body;
  try {
    const newRole = new CatRoleEntity();
    newRole.role = role;
    await newRole.save();
    for (const floor of floors) {
      const newDetailRoleFloorEntity = new DetailRoleFloorEntity();
      const floorFound = await CatFloorEntity.findOne({
        where: {
          id_cat_floor: floor.id_floor,
          status: true,
        },
      });
      newDetailRoleFloorEntity.cat_role = newRole!;
      newDetailRoleFloorEntity.cat_floor = floorFound!;
      await newDetailRoleFloorEntity.save();
    }
    const roleFound = await findExistingRole(newRole.id_cat_role!);
    return res.status(200).json({
      role: roleFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const roleDelete = async (req: Request, res: Response) => {
  const { id_cat_role } = req.params;
  try {
    const roleFound = await CatRoleEntity.findOne({
      where: {
        id_cat_role: parseInt(id_cat_role),
      },
    });
    roleFound!.status = false;
    await roleFound!.save();
    return res.status(200).json({
      role: roleFound
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const roleDeletePhysical = async (req: Request, res: Response) => {
  const { id_cat_role } = req.params;
  try {
    const roleFound = await CatRoleEntity.findOne({
      where: {
        id_cat_role: parseInt(id_cat_role),
      },
    });
    const foundDetailRoleFloorEntity = await DetailRoleFloorEntity.findBy({
      cat_role: !roleFound
    });
    for (const item of foundDetailRoleFloorEntity) {
      await item.remove();
    }
    const foundDetailUserRoleEntity = await DetailUserRoleEntity.findBy({
      cat_role: !roleFound
    });
    for (const item of foundDetailUserRoleEntity) {
      await item.remove();
    }
    await roleFound!.remove();

    return res.status(200).json({
      role: roleFound
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const findExistingRole = async (id_cat_role: number): Promise<CatRoleEntity> => {
  const roleFound: CatRoleEntity | null = await CatRoleEntity.createQueryBuilder('role')
    .leftJoinAndSelect('role.detail_role_floor', 'detail_role_floor')
    .leftJoinAndSelect('detail_role_floor.cat_floor', 'cat_floor')
    .where('role.id_cat_role = :id_cat_role AND role.status = :status', { id_cat_role, status: true })
    .getOne();
  return roleFound!;
};
