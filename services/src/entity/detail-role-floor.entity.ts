
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

  @ManyToOne(type => CatRoleEntity, (role: CatRoleEntity) => role.roleFloors)
  @JoinColumn({name: "fk_cat_role"})
  roles!: CatRoleEntity;
  
  @ManyToOne(type => CatFloorEntity, (floor: CatFloorEntity) => floor.floorRoles)
  @JoinColumn({name: "fk_cat_floor"})
  floors!: CatFloorEntity;

}
