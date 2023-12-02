
import { Request, Response } from "express";

import {
  CatEquipmentEntity, DetailEquipmentRoomTypeEntity,
} from "../../entity";
import { Equal } from "typeorm";


export const equipmentGet = async (req: Request, res: Response) => {
  try {
    const { id_cat_equipment } = req.params;
    const equipmentFound = await CatEquipmentEntity.findOne({
      where: {
        id_cat_equipment: parseInt(id_cat_equipment),
        status: true,
      },
    });
    return res.status(200).json({
      equipment: equipmentFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const equipmentGetAll = async (req: Request, res: Response) => {
  const { limit = 10, page = 1, pagination } = req.query;
  try {
    let equipmentsList: CatEquipmentEntity[] = [];
    if (pagination) {
      const parsedPage = parseInt(page as string, 10);
      const parsedLimit = parseInt(limit as string, 10);
      const skip = (parsedPage - 1) * parsedLimit;
      equipmentsList = await CatEquipmentEntity.find({
        skip,
        take: parsedLimit,
        where: {
          status: true,
        },
      });
    } else {
      equipmentsList = await CatEquipmentEntity.find({
        where: {
          status: true,
        },
      });
    }
    return res.status(200).json({
      list: equipmentsList,
      count: equipmentsList.length,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const equipmentPut = async (req: Request, res: Response) => {
  const { id_cat_equipment } = req.params;
  const {
    equipment,
    total_number_people,
    status
  } = req.body;
  try {
    const equipmentFound = await CatEquipmentEntity.findOneBy({
      id_cat_equipment: parseInt(id_cat_equipment),
    });
    equipmentFound!.equipment = equipment;
    equipmentFound!.total_number_people = total_number_people;
    equipmentFound!.status = status;
    await equipmentFound!.save();
    return res.status(200).json({
      equipment: equipmentFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const equipmentPost = async (req: Request, res: Response) => {
  const { equipment, total_number_people } = req.body;
  try {
    const newEquipment = new CatEquipmentEntity();
    newEquipment.equipment = equipment;
    newEquipment.total_number_people = total_number_people;
    await newEquipment.save();
    return res.status(200).json({
      equipment: newEquipment,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const equipmentDelete = async (req: Request, res: Response) => {
  const { id_cat_equipment } = req.params;
  try {
    const equipmentFound = await CatEquipmentEntity.findOne({
      where: {
        id_cat_equipment: parseInt(id_cat_equipment),
      },
    });
    equipmentFound!.status = false;
    await equipmentFound!.save();
    return res.status(200).json({
      equipment: equipmentFound
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const equipmentDeletePhysical = async (req: Request, res: Response) => {
  const { id_cat_equipment } = req.params;
  try {
    const equipmentFound = await CatEquipmentEntity.findOne({
      where: {
        id_cat_equipment: parseInt(id_cat_equipment),
      },
    });
    const foundDetailEquipmentRoomTypeEntity = await DetailEquipmentRoomTypeEntity.find({
      where: {
        cat_equipment: Equal(equipmentFound!.id_cat_equipment)
      }
    });
    for (const item of foundDetailEquipmentRoomTypeEntity) {
      await item.remove();
    }
    await equipmentFound!.remove()
    return res.status(200).json({
      equipment: equipmentFound
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
