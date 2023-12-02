
import { Request, Response } from "express";

import {
  CatEquipmentEntity,
  CatRoomEntity,
  CatRoomTypeEntity,
  CatSupplieEntity,
  DetailEquipmentRoomTypeEntity,
  DetailSupplieRoomTypeEntity,
} from "../../entity";
import { Equal } from "typeorm";
import { adjustValueBasedOnDay } from "../../calculous/get-price-by-day";


export const roomTypeGet = async (req: Request, res: Response) => {
  try {
    const { id_cat_room_type } = req.params;
    const roomTypeFound = await findExistingRoomType(parseInt(id_cat_room_type));
    
    const adjustedPrice = adjustValueBasedOnDay(roomTypeFound.price);
    const adjustedRoomTypeFound = { ...roomTypeFound, price: adjustedPrice };
    return res.status(200).json({
      roomType: adjustedRoomTypeFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const roomTypeGetAll = async (req: Request, res: Response) => {
  const { limit = 10, page = 1, pagination } = req.query;
  try {
    let roomTypesList: CatRoomTypeEntity[] = [];
    if (pagination) {
      const parsedPage = parseInt(page as string, 10);
      const parsedLimit = parseInt(limit as string, 10);
      const skip = (parsedPage - 1) * parsedLimit;
      roomTypesList = await CatRoomTypeEntity.createQueryBuilder('roomType')
        .leftJoinAndSelect('roomType.detail_equipment_room_type', 'detail_equipment_room_type')
        .leftJoinAndSelect('detail_equipment_room_type.cat_equipment', 'cat_equipment')
        .leftJoinAndSelect('roomType.detail_supplie_room_type', 'detail_supplie_room_type')
        .leftJoinAndSelect('detail_supplie_room_type.cat_supplie', 'cat_supplie')
        .limit(parsedLimit)
        .offset(skip)
        .where('roomType.status = :status', { status: true })
        .getMany();
    } else {
      roomTypesList = await CatRoomTypeEntity.createQueryBuilder('roomType')
        .leftJoinAndSelect('roomType.detail_equipment_room_type', 'detail_equipment_room_type')
        .leftJoinAndSelect('detail_equipment_room_type.cat_equipment', 'cat_equipment')
        .leftJoinAndSelect('roomType.detail_supplie_room_type', 'detail_supplie_room_type')
        .leftJoinAndSelect('detail_supplie_room_type.cat_supplie', 'cat_supplie')
        .where('roomType.status = :status', { status: true })
        .getMany();
    }
    const adjustedRoomTypesList = roomTypesList.map(roomType => {
      const adjustedPrice = adjustValueBasedOnDay(roomType.price);
      return { ...roomType, price: adjustedPrice };
    });
    return res.status(200).json({
      list: adjustedRoomTypesList,
      count: adjustedRoomTypesList.length,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const roomTypePut = async (req: Request, res: Response) => {
  const { id_cat_room_type } = req.params;
  const {
    room_type,
    price,
    status,
    supplies,
    equipments,
  }: {
    room_type: string;
    price: number;
    status: boolean;
    supplies: { id_supplie: string; total_supplies: number }[];
    equipments: { id_equipment: string; total_equipments: number }[];
  } = req.body;
  try {
    const roomTypeUpdating = await CatRoomTypeEntity.findOne({
      where: {
        id_cat_room_type: parseInt(id_cat_room_type),
      },
    });
    const foundDetailSupplieRoomTypeEntity = await DetailSupplieRoomTypeEntity.find({
      where: {
        cat_room_type: Equal(id_cat_room_type)
      }
    });
    const foundDetailEquipmentRoomTypeEntity = await DetailEquipmentRoomTypeEntity.find({
      where: {
        cat_room_type: Equal(id_cat_room_type)
      }
    });
    for (const item of foundDetailSupplieRoomTypeEntity) {
      await item.remove();
    }
    for (const item of foundDetailEquipmentRoomTypeEntity) {
      await item.remove();
    }

    roomTypeUpdating!.room_type = room_type;
    roomTypeUpdating!.price = price;
    roomTypeUpdating!.status = status;

    for (const supplie of supplies) {
      const newDetailSupplieRoomTypeEntity = new DetailSupplieRoomTypeEntity();
      newDetailSupplieRoomTypeEntity.total_supplies = supplie.total_supplies;
      const supplieFound = await CatSupplieEntity.findOne({
        where: {
          id_cat_supplie: parseInt(supplie.id_supplie),
          status: true,
        },
      });
      newDetailSupplieRoomTypeEntity.cat_supplie = supplieFound!;
      newDetailSupplieRoomTypeEntity.cat_room_type = roomTypeUpdating!;
      await newDetailSupplieRoomTypeEntity.save();
    }
    for (const equipment of equipments) {
      const newDetailEquipmentRoomTypeEntity = new DetailEquipmentRoomTypeEntity();
      newDetailEquipmentRoomTypeEntity.total_equipments = equipment.total_equipments;
      const equipmentFound = await CatEquipmentEntity.findOne({
        where: {
          id_cat_equipment: parseInt(equipment.id_equipment),
          status: true,
        },
      });
      newDetailEquipmentRoomTypeEntity.cat_equipment = equipmentFound!;
      newDetailEquipmentRoomTypeEntity.cat_room_type = roomTypeUpdating!;
      await newDetailEquipmentRoomTypeEntity.save();
    }
    await roomTypeUpdating!.save();

    const roomTypeFound = await findExistingRoomType(roomTypeUpdating!.id_cat_room_type!);

    return res.status(200).json({
      roomType: roomTypeFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};



export const roomTypePost = async (req: Request, res: Response) => {
  const {
    room_type,
    price,
    supplies,
    equipments,
  }: {
    room_type: string;
    price: number,
    supplies: { id_supplie: string; total_supplies: number }[];
    equipments: { id_equipment: string; total_equipments: number }[];
  } = req.body;
  try {
    const newRoomType = new CatRoomTypeEntity();
    newRoomType.room_type = room_type;
    newRoomType.price = price;
    await newRoomType.save();
    for (const supplie of supplies) {
      const newDetailSupplieRoomTypeEntity = new DetailSupplieRoomTypeEntity();
      newDetailSupplieRoomTypeEntity.total_supplies = supplie.total_supplies;
      const supplieFound = await CatSupplieEntity.findOne({
        where: {
          id_cat_supplie: parseInt(supplie.id_supplie),
          status: true,
        },
      });
      newDetailSupplieRoomTypeEntity.cat_supplie = supplieFound!;
      newDetailSupplieRoomTypeEntity.cat_room_type = newRoomType;
      await newDetailSupplieRoomTypeEntity.save();
    }
    for (const equipment of equipments) {
      const newDetailEquipmentRoomTypeEntity = new DetailEquipmentRoomTypeEntity();
      newDetailEquipmentRoomTypeEntity.total_equipments = equipment.total_equipments;
      const equipmentFound = await CatEquipmentEntity.findOne({
        where: {
          id_cat_equipment: parseInt(equipment.id_equipment),
          status: true,
        },
      });
      newDetailEquipmentRoomTypeEntity.cat_equipment = equipmentFound!;
      newDetailEquipmentRoomTypeEntity.cat_room_type = newRoomType;
      await newDetailEquipmentRoomTypeEntity.save();
    }

    const roomTypeFound = await findExistingRoomType(newRoomType.id_cat_room_type!);

    return res.status(200).json({
      roomType: roomTypeFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const roomTypeDelete = async (req: Request, res: Response) => {
  const { id_cat_room_type } = req.params;
  try {
    const roomTypeFound = await CatRoomTypeEntity.findOne({
      where: {
        id_cat_room_type: parseInt(id_cat_room_type),
      },
    });
    roomTypeFound!.status = false;
    await roomTypeFound!.save();
    return res.status(200).json({
      roomType: roomTypeFound
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const roomTypeDeletePhysical = async (req: Request, res: Response) => {
  const { id_cat_room_type } = req.params;
  try {
    const roomTypeFound = await CatRoomTypeEntity.findOne({
      where: {
        id_cat_room_type: parseInt(id_cat_room_type),
      },
    });
    const foundDetailEquipmentRoomTypeEntity = await DetailEquipmentRoomTypeEntity.findBy({
      cat_room_type: !roomTypeFound
    });
    for (const item of foundDetailEquipmentRoomTypeEntity) {
      await item.remove();
    }
    const foundDetailSupplieRoomTypeEntity = await DetailSupplieRoomTypeEntity.findBy({
      cat_room_type: !roomTypeFound
    });
    for (const item of foundDetailSupplieRoomTypeEntity) {
      await item.remove();
    }
    const foundCatRoomEntity = await CatRoomEntity.findBy({
      cat_room_type: !roomTypeFound
    });
    for (const item of foundCatRoomEntity) {
      await item.remove();
    }
    await roomTypeFound!.remove();
    return res.status(200).json({
      roomType: roomTypeFound
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const findExistingRoomType = async (id_cat_room_type: number): Promise<CatRoomTypeEntity> => {
  const roomTypeFound: CatRoomTypeEntity | null = await CatRoomTypeEntity.createQueryBuilder('roomType')
    .leftJoinAndSelect('roomType.detail_equipment_room_type', 'detail_equipment_room_type')
    .leftJoinAndSelect('detail_equipment_room_type.cat_equipment', 'cat_equipment')
    .leftJoinAndSelect('roomType.detail_supplie_room_type', 'detail_supplie_room_type')
    .leftJoinAndSelect('detail_supplie_room_type.cat_supplie', 'cat_supplie')
    .where('roomType.id_cat_room_type = :id_cat_room_type AND roomType.status = :status', { id_cat_room_type, status: true })
    .getOne();
  return roomTypeFound!;
};
