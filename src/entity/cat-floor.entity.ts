
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';

import { DetailRoleFloorEntity } from './detail-role-floor.entity';
import { CatRoomEntity } from './cat-room.entity';


@Entity({ name: 'cat_floor', schema: 'public' })
export class CatFloorEntity extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id_cat_floor?: number;

  @Column()
  number!: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ default: true })
  status: boolean = true;

  @OneToMany(type => CatRoomEntity, catRoomEntity => catRoomEntity.cat_floor)
  cat_floor!: CatFloorEntity[];

  @OneToMany(type => DetailRoleFloorEntity, (detailRoleFloor: DetailRoleFloorEntity) => detailRoleFloor.cat_floor)
  detail_role_floor!: DetailRoleFloorEntity[];
}
