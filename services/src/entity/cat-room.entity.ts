
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { CatFloorEntity } from './cat-floor.entity';
import { CatRoomStatusEntity } from './cat-room-status.entity';
import { CatRoomTypeEntity } from './cat-room-type.entity';


@Entity({ name: 'cat_room', schema: 'public' })
export class CatRoomEntity extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id_cat_room?: number;

  @Column()
  number!: number;
  
  @Column({ nullable: true })
  name?: string;

  @Column({ default: true })
  status: boolean = true;

  @ManyToOne(type => CatFloorEntity, catFloorEntity => catFloorEntity.id_cat_floor)
  @JoinColumn({name: "fk_cat_floor"})
  fkCatFloorEntity!: CatFloorEntity;
  
  @ManyToOne(type => CatRoomStatusEntity, catRoomStatusEntity => catRoomStatusEntity.id_cat_room_status)
  @JoinColumn({name: "fk_cat_room_status"})
  fkCatRoomStatusEntity!: CatRoomStatusEntity;
  
  @ManyToOne(type => CatRoomTypeEntity, catRoomTypeEntity => catRoomTypeEntity.id_cat_room_type)
  @JoinColumn({name: "fk_cat_room_type"})
  fkCatRoomTypeEntity!: CatRoomTypeEntity;

}
