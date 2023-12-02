
import { Request, Response } from "express";

import {
  CatSupplieEntity,
  DetailSupplieRoomTypeEntity,
} from "../../entity";
import { Equal } from "typeorm";


export const supplieGet = async (req: Request, res: Response) => {
  try {
    const { id_cat_supplie } = req.params;
    const supplieFound = await CatSupplieEntity.findOne({
      where: {
        id_cat_supplie: parseInt(id_cat_supplie),
        status: true,
      },
    });
    return res.status(200).json({
      supplie: supplieFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const supplieGetAll = async (req: Request, res: Response) => {
  const { limit = 10, page = 1, pagination } = req.query;
  try {
    let suppliesList: CatSupplieEntity[] = [];
    if (pagination) {
      const parsedPage = parseInt(page as string, 10);
      const parsedLimit = parseInt(limit as string, 10);
      const skip = (parsedPage - 1) * parsedLimit;
      suppliesList = await CatSupplieEntity.find({
        skip,
        take: parsedLimit,
        where: {
          status: true,
        },
      });
    } else {
      suppliesList = await CatSupplieEntity.find({
        where: {
          status: true,
        },
      });
    }
    return res.status(200).json({
      list: suppliesList,
      count: suppliesList.length,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const suppliePut = async (req: Request, res: Response) => {
  const { id_cat_supplie } = req.params;
  const {
    supplie,
    status
  } = req.body;
  try {
    const supplieFound = await CatSupplieEntity.findOne({
      where: {
        id_cat_supplie: parseInt(id_cat_supplie),
      },
    });
    supplieFound!.supplie = supplie;
    supplieFound!.status = status;
    await supplieFound!.save();
    return res.status(200).json({
      supplie: supplieFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const suppliePost = async (req: Request, res: Response) => {
  const { supplie } = req.body;
  try {
    const newSupplie = new CatSupplieEntity();
    newSupplie.supplie = supplie;
    await newSupplie.save();
    return res.status(200).json({
      supplie: newSupplie,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const supplieDelete = async (req: Request, res: Response) => {
  const { id_cat_supplie } = req.params;
  try {
    const supplieFound = await CatSupplieEntity.findOne({
      where: {
        id_cat_supplie: parseInt(id_cat_supplie),
      },
    });
    supplieFound!.status = false;
    await supplieFound!.save();
    return res.status(200).json({
      supplie: supplieFound
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const supplieDeletePhysical = async (req: Request, res: Response) => {
  const { id_cat_supplie } = req.params;
  try {
    const supplieFound = await CatSupplieEntity.findOne({
      where: {
        id_cat_supplie: parseInt(id_cat_supplie),
      },
    });
    const foundDetailSupplieRoomTypeEntity = await DetailSupplieRoomTypeEntity.find({
      where: {
        cat_supplie: Equal(supplieFound!.id_cat_supplie)
      }
    });
    for (const item of foundDetailSupplieRoomTypeEntity) {
      await item.remove();
    }
    await supplieFound!.remove();
    return res.status(200).json({
      supplie: supplieFound
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
