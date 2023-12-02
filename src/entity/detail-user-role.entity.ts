
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { CatRoleEntity } from './cat-role.entity';
import { CatUserEntity } from './cat-user.entity';


@Entity({ name: 'detail_user_role', schema: 'public' })
export class DetailUserRoleEntity extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id_detail_user_role?: number;

  @ManyToOne(type => CatUserEntity, (user: CatUserEntity) => user.detail_user_role)
  @JoinColumn({name: "fk_cat_user"})
  cat_user!: CatUserEntity;
  
  @ManyToOne(type => CatRoleEntity, (role: CatRoleEntity) => role.detail_user_role)
  @JoinColumn({name: "fk_cat_role"})
  cat_role!: CatRoleEntity;

}
