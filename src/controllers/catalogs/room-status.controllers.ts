
import { Request, Response } from "express";

import {
  CatRoomEntity,
  CatRoomStatusEntity,
} from "../../entity";
import { Equal } from "typeorm";


export const roomStatusGet = async (req: Request, res: Response) => {
  try {
    const { id_cat_room_status } = req.params;
    const roomStatusFound = await CatRoomStatusEntity.findOne({
      where: {
        id_cat_room_status: parseInt(id_cat_room_status),
        status: true,
      },
    });
    return res.status(200).json({
      roomStatus: roomStatusFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const roomStatusGetAll = async (req: Request, res: Response) => {
  const { limit = 10, page = 1, pagination } = req.query;
  try {
    let roomStatusList: CatRoomStatusEntity[] = [];
    if (pagination) {
      const parsedPage = parseInt(page as string, 10);
      const parsedLimit = parseInt(limit as string, 10);
      const skip = (parsedPage - 1) * parsedLimit;
      roomStatusList = await CatRoomStatusEntity.find({
        skip,
        take: parsedLimit,
        where: {
          status: true,
        },
      });
    } else {
      roomStatusList = await CatRoomStatusEntity.find({
        where: {
          status: true,
        },
      });
    }
    return res.status(200).json({
      list: roomStatusList,
      count: roomStatusList.length,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const roomStatusPut = async (req: Request, res: Response) => {
  const { id_cat_room_status } = req.params;
  const {
    dirty,
    busy,
    status
  } = req.body;
  try {
    const roomStatusFound = await CatRoomStatusEntity.findOne({
      where: {
        id_cat_room_status: parseInt(id_cat_room_status),
      },
    });
    roomStatusFound!.dirty = dirty;
    roomStatusFound!.busy = busy;
    roomStatusFound!.status = status;
    await roomStatusFound!.save();
    return res.status(200).json({
      roomStatus: roomStatusFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const roomStatusPost = async (req: Request, res: Response) => {
  const {
    dirty,
    busy,
  } = req.body;
  try {
    const newRoomStatus = new CatRoomStatusEntity();
    newRoomStatus.dirty = dirty;
    newRoomStatus.busy = busy;
    await newRoomStatus.save();
    return res.status(200).json({
      roomStatus: newRoomStatus,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const roomStatusDelete = async (req: Request, res: Response) => {
  const { id_cat_room_status } = req.params;
  try {
    const roomStatusFound = await CatRoomStatusEntity.findOne({
      where: {
        id_cat_room_status: parseInt(id_cat_room_status),
      },
    });
    roomStatusFound!.status = false;
    await roomStatusFound!.save();
    return res.status(200).json({
      roomStatus: roomStatusFound
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const roomStatusDeletePhysical = async (req: Request, res: Response) => {
  const { id_cat_room_status } = req.params;
  try {
    const roomStatusFound = await CatRoomStatusEntity.findOne({
      where: {
        id_cat_room_status: parseInt(id_cat_room_status),
      },
    });
    const foundCatRoomEntity = await CatRoomEntity.find({
      where: {
        cat_room_type: Equal(roomStatusFound!.id_cat_room_status)
      }
    });
    for (const item of foundCatRoomEntity) {
      await item.remove();
    }
    await roomStatusFound!.remove();
    return res.status(200).json({
      roomStatus: roomStatusFound
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
