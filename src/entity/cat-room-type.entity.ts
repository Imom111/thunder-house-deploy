
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';

import { DetailEquipmentRoomTypeEntity } from './detail-equipment-room-type';
import { CatRoomEntity } from './cat-room.entity';
import { DetailSupplieRoomTypeEntity } from './detail-supplie-room-type.entity';


@Entity({ name: 'cat_room_type', schema: 'public' })
export class CatRoomTypeEntity extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id_cat_room_type?: number;

  @Column()
  room_type!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  @Column({ default: true })
  status: boolean = true;
  
  @OneToMany(type => CatRoomEntity, catRoomEntity => catRoomEntity.cat_room_type)
  cat_room!: CatRoomEntity[];

  @OneToMany(type => DetailEquipmentRoomTypeEntity, (detailEquipmentRoomTypeEntity: DetailEquipmentRoomTypeEntity) => detailEquipmentRoomTypeEntity.cat_room_type)
  detail_equipment_room_type!: DetailEquipmentRoomTypeEntity[];
  
  @OneToMany(type => DetailSupplieRoomTypeEntity, (detailSupplieRoomTypeEntity: DetailSupplieRoomTypeEntity) => detailSupplieRoomTypeEntity.cat_room_type)
  detail_supplie_room_type!: DetailSupplieRoomTypeEntity[];

}
