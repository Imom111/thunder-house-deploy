
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CatClientEntity } from './cat-client.entity';
import { DetailReservationRoomEntity } from './detail-reservation-room.entity';


@Entity({ name: 'cat_reservation', schema: 'public' })
export class CatReservationEntity extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id_cat_reservation?: number;
  
  @Column()
  is_from_platform_promotion!: boolean;

  @Column()
  group_leader!: string;
  
  @Column()
  sub_group_leader!: string;

  @Column({ type: 'timestamp' })
  date_reservation: Date = new Date();

  // breakfast
  @Column()
  has_breakfast!: boolean;
  
  // stay
  @Column({ type: 'date' })
  start_date!: Date;

  @Column({ type: 'date' })
  end_date!: Date;

  @Column({ default: 0, nullable: false })
  subtotal: number = 0;

  @Column({ default: 0, nullable: false })
  total: number = 0;

  @Column({ type: 'int' })
  status_progress: number = 0;

  @ManyToOne(type => CatClientEntity, catClientEntity => catClientEntity.id_cat_client)
  @JoinColumn({name: "fk_cat_client"})
  cat_client?: CatClientEntity;

  @OneToMany(type => DetailReservationRoomEntity, (detailReservationRoomEntity: DetailReservationRoomEntity) => detailReservationRoomEntity.cat_reservation)
  detail_reservation_room!: DetailReservationRoomEntity[];
}
