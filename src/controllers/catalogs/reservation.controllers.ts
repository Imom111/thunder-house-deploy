
import { Request, Response } from "express";

import {
  CatClientEntity,
  CatReservationEntity,
  CatRoomEntity,
  DetailReservationRoomEntity,
} from "../../entity";
import { getPrice } from "../../calculous/get-price-by-day";
import { COST_BREAKFAST } from "../../calculous/get-price-reservation";


export const reservationGet = async (req: Request, res: Response) => {
  try {
    const { id_cat_reservation } = req.params;
    const reservationFound = await findExistingReservation(parseInt(id_cat_reservation))
    return res.status(200).json({
      reservation: reservationFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const reservationGetAll = async (req: Request, res: Response) => {
  const { limit = 10, page = 1, pagination } = req.query;
  try {
    let reservationList: CatReservationEntity[] = [];
    if (pagination) {
      const parsedPage = parseInt(page as string, 10);
      const parsedLimit = parseInt(limit as string, 10);
      const skip = (parsedPage - 1) * parsedLimit;
      reservationList = await CatReservationEntity
        .createQueryBuilder('reservation')
        .leftJoinAndSelect('reservation.cat_client', 'client')
        .leftJoinAndSelect('client.cat_user', 'user')
        .leftJoinAndSelect('client.cat_person', 'person')
        .leftJoinAndSelect('reservation.detail_reservation_room', 'detailReservationRoom')
        .leftJoinAndSelect('detailReservationRoom.cat_room', 'room')
        .leftJoinAndSelect('room.cat_floor', 'floor')
        .leftJoinAndSelect('room.cat_room_status', 'roomStatus')
        .leftJoinAndSelect('room.cat_room_type', 'roomType')
        .limit(parsedLimit)
        .offset(skip)
        .getMany();
    } else {
      reservationList = await CatReservationEntity
        .createQueryBuilder('reservation')
        .leftJoinAndSelect('reservation.cat_client', 'client')
        .leftJoinAndSelect('client.cat_user', 'user')
        .leftJoinAndSelect('client.cat_person', 'person')
        .leftJoinAndSelect('reservation.detail_reservation_room', 'detailReservationRoom')
        .leftJoinAndSelect('detailReservationRoom.cat_room', 'room')
        .leftJoinAndSelect('room.cat_floor', 'floor')
        .leftJoinAndSelect('room.cat_room_status', 'roomStatus')
        .leftJoinAndSelect('room.cat_room_type', 'roomType')
        .getMany();
    }
    return res.status(200).json({
      list: reservationList,
      count: reservationList.length,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const reservationPut = async (req: Request, res: Response) => {
  const { id_cat_reservation } = req.params;
  const {
    group_leader,
    sub_group_leader,
    is_from_platform_promotion,
    fk_cat_client,
  }: {
    group_leader: string,
    sub_group_leader: string,
    is_from_platform_promotion: boolean,
    observations: string,
    extra_charges: number,
    fk_cat_client: number,
  } = req.body;
  try {
    // const reservationFound = await CatReservationEntity.findOne({
    //   where: {
    //     id_cat_reservation: parseInt(id_cat_reservation),
    //   },
    // });
    // reservationFound!.group_leader = group_leader;
    // reservationFound!.sub_group_leader = sub_group_leader;
    // reservationFound!.is_from_platform_promotion = is_from_platform_promotion;
    // const clientFound = await CatClientEntity.findOneBy({
    //   id_cat_client: fk_cat_client,
    // });
    // reservationFound!.cat_client = clientFound!;
    // reservationFound!.save();
    // return res.status(200).json({
    //   reservation: reservationFound,
    // });
    res.status(500).json({ msg: "Service not allowed" });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const reservationPost = async (req: Request, res: Response) => {
  const {
    group_leader,
    sub_group_leader,
    is_from_platform_promotion,
    has_breakfast,
    start_date,
    end_date,
    fk_cat_client,
    detail_reservation_room,
  }: {
    group_leader: string,
    sub_group_leader: string,
    is_from_platform_promotion: boolean,
    fk_cat_client: number,
    has_breakfast: boolean,
    start_date: string,
    end_date: string,
    detail_reservation_room: {
      fk_cat_room: number,
      total_people_booked: number,
    }[],
  } = req.body;
  try {
    let totalPriceByRooms: number = 0;
    let totalPersonsByRooms: number = 0;

    const clientFound = await CatClientEntity.findOneBy({
      id_cat_client: fk_cat_client,
    });

    const newReservation = new CatReservationEntity();
    newReservation.group_leader = group_leader;
    newReservation.sub_group_leader = sub_group_leader;
    newReservation.is_from_platform_promotion = is_from_platform_promotion;
    newReservation.has_breakfast = has_breakfast;
    newReservation.start_date = new Date(start_date);
    newReservation.end_date = new Date(end_date);
    newReservation.cat_client = clientFound!;

    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.ceil(Math.abs((newReservation.end_date.getTime() - newReservation.start_date.getTime()) / oneDay));

    const arrEntitiesDetail: DetailReservationRoomEntity[] = [];
    for (const detail_room of detail_reservation_room) {
      const newDetailReservationRoom = new DetailReservationRoomEntity();
      newDetailReservationRoom.total_people_booked = detail_room.total_people_booked;
      const roomFound = await CatRoomEntity.findOne({
        where: {
          id_cat_room: detail_room.fk_cat_room,
        },
        relations: {
          cat_room_type: true,
        }
      });
      newDetailReservationRoom.cat_room = roomFound!;
      
      totalPersonsByRooms += Number(detail_room.total_people_booked);
      totalPriceByRooms += Number(roomFound!.cat_room_type.price) * diffDays;
      arrEntitiesDetail.push(newDetailReservationRoom);
    }
    if (has_breakfast) {
      totalPriceByRooms += COST_BREAKFAST * totalPersonsByRooms * diffDays;
    }
    const totalPriceReservation = getPrice(totalPriceByRooms, totalPersonsByRooms, is_from_platform_promotion);
    newReservation.total = totalPriceByRooms;
    newReservation.subtotal = totalPriceReservation;
    newReservation.status_progress = 1;
    await newReservation.save();

    
    for (const etity_detail of arrEntitiesDetail) {
      etity_detail.cat_reservation = newReservation;
      await etity_detail.save();
    }

    const reservationFound = await findExistingReservation(newReservation.id_cat_reservation!);
    return res.status(200).json({
      reservation: reservationFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const findExistingReservation = async (id_cat_reservation: number): Promise<CatReservationEntity | null> => {
const reservationFound = await CatReservationEntity
  .createQueryBuilder('reservation')
  .leftJoinAndSelect('reservation.cat_client', 'client')
  .leftJoinAndSelect('client.cat_user', 'user')
  .leftJoinAndSelect('client.cat_person', 'person')
  .leftJoinAndSelect('reservation.detail_reservation_room', 'detailReservationRoom')
  .leftJoinAndSelect('detailReservationRoom.cat_room', 'room')
  .leftJoinAndSelect('room.cat_floor', 'floor')
  .leftJoinAndSelect('room.cat_room_status', 'roomStatus')
  .leftJoinAndSelect('room.cat_room_type', 'roomType')
  .where('reservation.id_cat_reservation = :id_cat_reservation', { id_cat_reservation })
  .getOne();
  return reservationFound;
};

