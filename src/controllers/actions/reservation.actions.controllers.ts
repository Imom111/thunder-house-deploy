

import { Request, Response } from "express";

import { 
  CatReservationEntity,
  DetailReservationRoomEntity,
} from "../../entity";
import {
  COST_EXTRA_PARKING_PASS,
  COST_EXTRA_PARKING_PASS_FORGOT,
  COST_EXTRA_PEOPLE,
  COST_KEY_FORGOT,
  COST_PARKING_PASS_FORGOT,
} from "../../calculous/get-price-reservation";


export const registerArrive = async (req: Request, res: Response) => {
  const { id_cat_reservation } = req.params;
  const {
    detail_reservation_room,
  }: {
    detail_reservation_room: {
      id_detail_reservation_room: number,
      total_people_arrived: number,
      parking_pass_delivered: boolean,
      extra_parking_pass: number,
      key_delivered: boolean,
      baggage_claim: boolean,
      supplies_delivered: boolean,
    }[]
  } = req.body;
  try {
    let totalExtra = 0;
    detail_reservation_room.forEach(async detailReservation => {
      const reservationFound: DetailReservationRoomEntity | null = await DetailReservationRoomEntity.findOne({
        where: {
          id_detail_reservation_room: detailReservation.id_detail_reservation_room,
        },
      });
      if (reservationFound) {
        reservationFound.total_people_arrived = detailReservation.total_people_arrived;
        reservationFound.parking_pass_delivered = detailReservation.parking_pass_delivered;
        reservationFound.extra_parking_pass = detailReservation.extra_parking_pass;
        reservationFound.key_delivered = detailReservation.key_delivered;
        reservationFound.baggage_claim = detailReservation.baggage_claim;
        reservationFound.supplies_delivered = detailReservation.supplies_delivered;
        await reservationFound.save();
        totalExtra += detailReservation.extra_parking_pass * COST_EXTRA_PARKING_PASS;
        if (reservationFound.total_people_arrived > reservationFound.total_people_booked) {
          totalExtra += (reservationFound.total_people_arrived - reservationFound.total_people_booked) * COST_EXTRA_PEOPLE;
        }
      }
    });
    const reservationFound: CatReservationEntity | null = await CatReservationEntity.findOne({
      where: {
        id_cat_reservation: parseInt(id_cat_reservation),
      },
    });
    reservationFound!.subtotal = Number(reservationFound!.subtotal + totalExtra);
    reservationFound!.status_progress = 2;
    reservationFound!.save();
    return res.status(200).json({
      reservation: reservationFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};


export const registerOutput = async (req: Request, res: Response) => {
  const { id_cat_reservation } = req.params;
  const {
    detail_reservation_room,
  }: {
    detail_reservation_room: {
      id_detail_reservation_room: number,
      extra_parking_pass_returned: number,
      parking_pass_returned: boolean,
      parking_pass_forgot: boolean,
      key_returned: boolean,
      key_forgot: boolean,
      observations: string | null,
      extra_charges: number | null,
    }[]
  } = req.body;
  try {
    let totalExtra = 0;
    detail_reservation_room.forEach(async detailReservation => {
      const reservationFound: DetailReservationRoomEntity | null = await DetailReservationRoomEntity.findOne({
        where: {
          id_detail_reservation_room: detailReservation.id_detail_reservation_room,
        },
      });
      if (reservationFound) {
        reservationFound.extra_parking_pass_returned = detailReservation.extra_parking_pass_returned;
        reservationFound.parking_pass_returned = detailReservation.parking_pass_returned;
        reservationFound.parking_pass_forgot = detailReservation.parking_pass_forgot;
        reservationFound.key_returned = detailReservation.key_returned;
        reservationFound.key_forgot = detailReservation.key_forgot;
        reservationFound.observations = detailReservation.observations;
        reservationFound.extra_charges = detailReservation.extra_charges;
        await reservationFound.save();
        if (reservationFound.extra_parking_pass) {
          if (reservationFound.extra_parking_pass_returned < reservationFound.extra_parking_pass) {
            totalExtra += (reservationFound.extra_parking_pass - reservationFound.extra_parking_pass_returned) * COST_EXTRA_PARKING_PASS_FORGOT;
          }
        }
        if (!reservationFound.parking_pass_forgot) {
          totalExtra += COST_PARKING_PASS_FORGOT;
        }
        if (!reservationFound.key_forgot) {
          totalExtra += COST_KEY_FORGOT;
        }
        if (reservationFound.extra_charges) {
          totalExtra += Number(reservationFound.extra_charges);
        }
      }
    });
    const reservationFound: CatReservationEntity | null = await CatReservationEntity.findOne({
      where: {
        id_cat_reservation: parseInt(id_cat_reservation),
      },
    });
    reservationFound!.subtotal = Number(reservationFound!.subtotal + totalExtra);
    reservationFound!.status_progress = 3;
    reservationFound!.save();
    return res.status(200).json({
      reservation: reservationFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
