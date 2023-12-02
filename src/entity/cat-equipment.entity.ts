
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';

import { DetailEquipmentRoomTypeEntity } from './detail-equipment-room-type';


@Entity({ name: 'cat_equipment', schema: 'public' })
export class CatEquipmentEntity extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id_cat_equipment?: number;

  @Column()
  equipment!: string;

  @Column()
  total_number_people!: number;

  @Column({ default: true })
  status: boolean = true;

  @OneToMany(type => DetailEquipmentRoomTypeEntity, (detailEquipmentRoomTypeEntity: DetailEquipmentRoomTypeEntity) => detailEquipmentRoomTypeEntity.cat_equipment)
  detail_equipment_room_type!: DetailEquipmentRoomTypeEntity[];
}
