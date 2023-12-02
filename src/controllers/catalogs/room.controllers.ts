
import { Request, Response } from "express";

import {
  CatFloorEntity,
  CatRoomEntity,
  CatRoomStatusEntity,
  CatRoomTypeEntity,
} from "../../entity";


export const roomGet = async (req: Request, res: Response) => {
  try {
    const { id_cat_room } = req.params;
    const roomFound = await findExistingRoom(parseInt(id_cat_room));
    return res.status(200).json({
      room: roomFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const roomGetAll = async (req: Request, res: Response) => {
  const { limit = 10, page = 1, pagination } = req.query;
  try {
    let roomsList: CatRoomEntity[] = [];
    if (pagination) {
      const parsedPage = parseInt(page as string, 10);
      const parsedLimit = parseInt(limit as string, 10);
      const skip = (parsedPage - 1) * parsedLimit;
      roomsList = await CatRoomEntity.find({
        relations: {
          cat_floor: true,
          cat_room_type: true,
          cat_room_status: true,
        },
        skip,
        take: parsedLimit,
        where: {
          status: true,
        },
      });
    } else {
      roomsList = await CatRoomEntity.find({
        relations: {
          cat_floor: true,
          cat_room_type: true,
          cat_room_status: true,
        },
        where: {
          status: true,
        },
      });
    }
    return res.status(200).json({
      list: roomsList,
      count: roomsList.length,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const roomPut = async (req: Request, res: Response) => {
  const { id_cat_room } = req.params;
  const {
    number,
    name,
    status,
    fk_cat_floor,
    fk_cat_room_status,
    fk_cat_room_type,
  } = req.body;
  try {
    const roomUpdating = await CatRoomEntity.findOne({
      where: {
        id_cat_room: parseInt(id_cat_room),
      },
    });
    roomUpdating!.number = number;
    roomUpdating!.name = name;
    roomUpdating!.status = status;
    const floorFound = await CatFloorEntity.findOne({
      where: {
        id_cat_floor: fk_cat_floor,
        status: true,
      },
    });
    roomUpdating!.cat_floor = floorFound!;
    const roomStatusFound = await CatRoomStatusEntity.findOne({
      where: {
        id_cat_room_status: fk_cat_room_status,
        status: true,
      },
    });
    roomUpdating!.cat_room_status = roomStatusFound!;
    const roomTypeFound = await CatRoomTypeEntity.findOne({
      where: {
        id_cat_room_type: fk_cat_room_type,
        status: true,
      },
    });
    roomUpdating!.cat_room_type = roomTypeFound!;
    await roomUpdating!.save();

    const roomFound = await findExistingRoom(roomUpdating!.id_cat_room!);

    return res.status(200).json({
      room: roomFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const roomPost = async (req: Request, res: Response) => {
  const {
    number,
    name,
    fk_cat_floor,
    fk_cat_room_status,
    fk_cat_room_type,
  } = req.body;
  try {
    const newRoom = new CatRoomEntity();
    newRoom.number = number;
    newRoom.name = name;
    const floorFound = await CatFloorEntity.findOne({
      where: {
        id_cat_floor: fk_cat_floor,
        status: true,
      },
    });
    newRoom.cat_floor = floorFound!;
    const roomStatusFound = await CatRoomStatusEntity.findOne({
      where: {
        id_cat_room_status: fk_cat_room_status,
        status: true,
      },
    });
    newRoom.cat_room_status = roomStatusFound!;
    const roomTypeFound = await CatRoomTypeEntity.findOne({
      where: {
        id_cat_room_type: fk_cat_room_type,
        status: true,
      },
    });
    newRoom.cat_room_type = roomTypeFound!;
    await newRoom.save();

    const roomFound = await findExistingRoom(newRoom!.id_cat_room!);

    return res.status(200).json({
      room: roomFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const roomDelete = async (req: Request, res: Response) => {
  const { id_cat_room } = req.params;
  try {
    const roomFound = await CatRoomEntity.findOne({
      where: {
        id_cat_room: parseInt(id_cat_room),
      },
    });
    roomFound!.status = false;
    await roomFound!.save();
    return res.status(200).json({
      room: roomFound
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};


export const roomDeletePhysical = async (req: Request, res: Response) => {
  const { id_cat_room } = req.params;
  try {
    const roomFound = await CatRoomEntity.findOne({
      where: {
        id_cat_room: parseInt(id_cat_room),
      },
    });
    await roomFound!.remove();
    return res.status(200).json({
      room: roomFound
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const findExistingRoom = async (id_cat_room: number): Promise<CatRoomEntity> => {
  const roomFound: CatRoomEntity | null = await CatRoomEntity.findOne({
    relations: {
      cat_floor: true,
      cat_room_type: true,
      cat_room_status: true,
    },
    where: {
      status: true,
      id_cat_room,
    }
  });
  return roomFound!;
};
