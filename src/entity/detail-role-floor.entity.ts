
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { CatRoleEntity } from './cat-role.entity';
import { CatFloorEntity } from './cat-floor.entity';


@Entity({ name: 'detail_role_floor', schema: 'public' })
export class DetailRoleFloorEntity extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id_detail_role_floor?: number;

  @ManyToOne(type => CatRoleEntity, (role: CatRoleEntity) => role.detail_role_floor)
  @JoinColumn({name: "fk_cat_role"})
  cat_role!: CatRoleEntity;
  
  @ManyToOne(type => CatFloorEntity, (floor: CatFloorEntity) => floor.detail_role_floor)
  @JoinColumn({name: "fk_cat_floor"})
  cat_floor!: CatFloorEntity;

}
