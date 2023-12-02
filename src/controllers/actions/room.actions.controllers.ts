
import { Request, Response } from "express";

import { 
  CatReservationEntity,
  CatRoomEntity,
  CatRoomStatusEntity,
  CatRoomTypeEntity,
  DetailReservationRoomEntity,
} from "../../entity";
import AppDataSource from "../../database/config";


export const changeRoomStatus = async (req: Request, res: Response) => {
  const { id_cat_room } = req.params;
  const {
    id_cat_room_status,
  }: {
    id_cat_room_status: number,
  } = req.body;
  try {
    const roomFound = await CatRoomEntity.findOne({
      where: {
        id_cat_room: parseInt(id_cat_room),
        status: true,
      },
    });
    const roomStatusFound = await CatRoomStatusEntity.findOne({
      where: {
        id_cat_room_status,
        status: true,
      },
    });
    roomFound!.cat_room_status = roomStatusFound!;
    await roomFound!.save();
    return res.status(200).json({
      room: roomFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};


export const getRoomsByFloor = async (req: Request, res: Response) => {
  const { id_cat_floor } = req.params;
  try {
    const roomsFound: CatRoomEntity[] | null = await CatRoomEntity.find({
      relations: {
        cat_floor: true,
        cat_room_type: true,
        cat_room_status: true,
      },
      where: {
        status: true,
        cat_floor: {
          id_cat_floor: parseInt(id_cat_floor),
          status: true,
        },
      }
    });
    return res.status(200).json({
      rooms: roomsFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const getRoomsAvailability = async (req: Request, res: Response) => {
  try {
    const roomsFound: CatRoomEntity[] | null = await CatRoomEntity.find({
      relations: {
        cat_floor: true,
        cat_room_type: true,
        cat_room_status: true,
      },
    });
    let freeRooms = 0;
    let busyRooms = 0;
    let maintenanceRooms = 0;
    roomsFound.forEach(room => {
      const isBusy = room.cat_room_status.busy;
      const isDirty = room.cat_room_status.dirty;
      if (isDirty) {
        maintenanceRooms++;
        return;
      }
      if (isBusy) {
        busyRooms++;
        return;
      }
      freeRooms++;
    });
    return res.status(200).json({
      totalRooms: roomsFound.length,
      statistics: {
        totalFreeRooms: freeRooms,
        totalBusyRooms: busyRooms,
        totalMaintenanceRooms: maintenanceRooms,
      },
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const getBusyRooms = async (req: Request, res: Response) => {
  try {
    const {
      id_cat_room_type,
      start_date,
      end_date,
    } = req.query;
    const result = await AppDataSource
      .createQueryBuilder()
      .select('cr.id_cat_room', 'id_cat_room')
      .addSelect('crt.id_cat_room_type', 'id_cat_room_type')
      .addSelect('crs.start_date', 'start_date')
      .addSelect('crs.end_date', 'end_date')
      .from(CatRoomEntity, 'cr')
      .leftJoin(DetailReservationRoomEntity, 'drr', 'cr.id_cat_room = drr.fk_cat_room')
      .leftJoin(CatReservationEntity, 'crs', 'drr.fk_cat_reservation = crs.id_cat_reservation AND (' +
        'crs.start_date BETWEEN :start_date AND :end_date OR ' +
        'crs.end_date BETWEEN :start_date AND :end_date OR ' +
        ':start_date BETWEEN crs.start_date AND crs.end_date OR ' +
        ':end_date BETWEEN crs.start_date AND crs.end_date)', 
        { start_date, end_date })
      .innerJoin(CatRoomTypeEntity, 'crt', 'cr.fk_cat_room_type = crt.id_cat_room_type')
      .where('crt.id_cat_room_type = :id_cat_room_type', { id_cat_room_type })
      .getRawMany();

    const formattedResult = result.map(room => ({
      id_cat_room: room.id_cat_room,
      id_cat_room_type: room.id_cat_room_type,
      busy_dates: room.start_date && room.end_date ? {
        start_date: room.start_date.toISOString().split('T')[0],
        end_date: room.end_date.toISOString().split('T')[0]
      } : null
    }));

    return res.status(200).json({
      rooms: formattedResult
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const getBusyDatesByDate = async (req: Request, res: Response) => {
  try {
    const {
      start_date,
      end_date,
    } = req.query;
    const result = await AppDataSource
      .createQueryBuilder()
      .select('cr.id_cat_room', 'id_cat_room')
      .addSelect('crt.id_cat_room_type', 'id_cat_room_type')
      .addSelect('crs.start_date', 'start_date')
      .addSelect('crs.end_date', 'end_date')
      .from(CatRoomEntity, 'cr')
      .leftJoin(DetailReservationRoomEntity, 'drr', 'cr.id_cat_room = drr.fk_cat_room')
      .leftJoin(CatReservationEntity, 'crs', 'drr.fk_cat_reservation = crs.id_cat_reservation AND (' +
        'crs.start_date BETWEEN :start_date AND :end_date OR ' +
        'crs.end_date BETWEEN :start_date AND :end_date OR ' +
        ':start_date BETWEEN crs.start_date AND crs.end_date OR ' +
        ':end_date BETWEEN crs.start_date AND crs.end_date)', 
        { start_date, end_date })
      .innerJoin(CatRoomTypeEntity, 'crt', 'cr.fk_cat_room_type = crt.id_cat_room_type')
      .getRawMany();

    const filteredResult = result.filter(room => room.start_date === null && room.end_date === null)
      .map(room => ({
        id_cat_room: room.id_cat_room,
        id_cat_room_type: room.id_cat_room_type
      }));

    return res.status(200).json({
      rooms: filteredResult
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
