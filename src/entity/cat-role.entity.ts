
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';

import { DetailUserRoleEntity } from './detail-user-role.entity';
import { DetailRoleFloorEntity } from './detail-role-floor.entity';


@Entity({ name: 'cat_role', schema: 'public' })
export class CatRoleEntity extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id_cat_role?: number;

  @Column()
  role!: string;

  @Column({ default: true })
  status: boolean = true;

  @OneToMany(type => DetailUserRoleEntity, (detailUserRole: DetailUserRoleEntity) => detailUserRole.cat_role)
  detail_user_role!: DetailUserRoleEntity[];

  @OneToMany(type => DetailRoleFloorEntity, (detailRoleFloor: DetailRoleFloorEntity) => detailRoleFloor.cat_role)
  detail_role_floor!: DetailRoleFloorEntity[];
}
