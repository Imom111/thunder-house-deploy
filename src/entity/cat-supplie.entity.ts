
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';

import { DetailSupplieRoomTypeEntity } from './detail-supplie-room-type.entity';


@Entity({ name: 'cat_supplie', schema: 'public' })
export class CatSupplieEntity extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id_cat_supplie?: number;

  @Column()
  supplie!: string;

  @Column({ default: true })
  status: boolean = true;

  @OneToMany(type => DetailSupplieRoomTypeEntity, (detailSupplieRoomTypeEntity: DetailSupplieRoomTypeEntity) => detailSupplieRoomTypeEntity.cat_supplie)
  detail_supplie_room_type!: DetailSupplieRoomTypeEntity[];
}
