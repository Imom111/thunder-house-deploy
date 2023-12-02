
import { Request, Response } from "express";

import {
  CatFloorEntity,
  CatRoomEntity,
  DetailRoleFloorEntity,
} from "../../entity";
import { Equal } from "typeorm";


export const floorGet = async (req: Request, res: Response) => {
  try {
    const { id_cat_floor } = req.params;
    const floorFound = await CatFloorEntity.findOne({
      where: {
        id_cat_floor: parseInt(id_cat_floor),
        status: true,
      },
    });
    return res.status(200).json({
      floor: floorFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const floorGetAll = async (req: Request, res: Response) => {
  const { limit = 10, page = 1, pagination } = req.query;
  try {
    let floorsList: CatFloorEntity[] = [];
    if (pagination) {
      const parsedPage = parseInt(page as string, 10);
      const parsedLimit = parseInt(limit as string, 10);
      const skip = (parsedPage - 1) * parsedLimit;
      floorsList = await CatFloorEntity.find({
        skip,
        take: parsedLimit,
        where: {
          status: true,
        },
      });
    } else {
      floorsList = await CatFloorEntity.find({
        where: {
          status: true,
        },
      });
    }
    return res.status(200).json({
      list: floorsList,
      count: floorsList.length,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const floorPut = async (req: Request, res: Response) => {
  const { id_cat_floor } = req.params;
  const {
    number,
    name,
    status
  } = req.body;
  try {
    const floorFound = await CatFloorEntity.findOne({
      where: {
        id_cat_floor: parseInt(id_cat_floor),
      },
    });
    floorFound!.number = number;
    floorFound!.name = name;
    floorFound!.status = status;
    await floorFound!.save();
    return res.status(200).json({
      floor: floorFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const floorPost = async (req: Request, res: Response) => {
  const { number, name } = req.body;
  try {
    const newFloor = new CatFloorEntity();
    newFloor.number = number;
    newFloor.name = name;
    await newFloor.save();
    return res.status(200).json({
      floor: newFloor,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const floorDelete = async (req: Request, res: Response) => {
  const { id_cat_floor } = req.params;
  try {
    const floorFound = await CatFloorEntity.findOne({
      where: {
        id_cat_floor: parseInt(id_cat_floor),
      },
    });
    floorFound!.status = false;
    await floorFound!.save();
    return res.status(200).json({
      floor: floorFound
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const floorDeletePhysical = async (req: Request, res: Response) => {
  const { id_cat_floor } = req.params;
  try {
    const floorFound = await CatFloorEntity.findOne({
      where: {
        id_cat_floor: parseInt(id_cat_floor),
      },
    });
    const foundDetailRoleFloorEntity = await DetailRoleFloorEntity.findBy({
      cat_floor: !floorFound
    });
    for (const item of foundDetailRoleFloorEntity) {
      await item.remove();
    }
    const foundCatRoomEntity = await CatRoomEntity.find({
      where: {
        cat_floor: Equal(floorFound!.id_cat_floor)
      }
    });
    for (const item of foundCatRoomEntity) {
      await item.remove();
    }
    await floorFound!.remove();
    return res.status(200).json({
      floor: floorFound
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
