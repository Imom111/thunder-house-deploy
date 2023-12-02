
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';

import { CatReservationEntity } from './cat-reservation.entity';
import { CatRoomEntity } from './cat-room.entity';


@Entity({ name: 'detail_reservation_room', schema: 'public' })
export class DetailReservationRoomEntity extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id_detail_reservation_room?: number;

  // total people
  @Column()
  total_people_booked!: number;

  @Column({ type: 'int', nullable: true, default: () => 'NULL' })
  total_people_arrived: number | null = null;

  // parking pass
  @Column({ default: false })
  parking_pass_delivered: boolean = false;

  @Column({ default: false })
  parking_pass_returned: boolean = false;

  @Column({ nullable: true })
  parking_pass_forgot: boolean = false;

  // extra parking pass
  @Column({ type: 'int', nullable: true, default: () => 'NULL' })
  extra_parking_pass: number | null = null;

  @Column({ type: 'int', nullable: true, default: () => 'NULL' })
  extra_parking_pass_returned: number | null = null;

  // key
  @Column({ default: false })
  key_delivered: boolean = false;

  @Column({ default: false })
  key_returned: boolean = false;

  @Column({ default: false })
  key_forgot: boolean = false;

  // baggage claim
  @Column({ default: false })
  baggage_claim: boolean = false;

  // supplies
  @Column({ default: false })
  supplies_delivered: boolean = false;
  
  // observations
  @Column({ type: 'text', nullable: true, default: () => 'NULL' })
  observations: string | null = null;
  
  // extra charges
  @Column("decimal", { precision: 10, scale: 2, nullable: true, default: () => 'NULL' })
  extra_charges: number | null = null;

  @ManyToOne(type => CatReservationEntity, (reservation: CatReservationEntity) => reservation.detail_reservation_room)
  @JoinColumn({name: "fk_cat_reservation"})
  cat_reservation!: CatReservationEntity;

  @ManyToOne(type => CatRoomEntity, (room: CatRoomEntity) => room.detail_reservation_room)
  @JoinColumn({name: "fk_cat_room"})
  cat_room!: CatRoomEntity;

}
