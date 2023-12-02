
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';

import { DetailUserRoleEntity } from './detail-user-role.entity';
import { CatClientEntity } from './cat-client.entity';
import { CatEmployeeEntity } from './cat-employee.entity';


@Entity({ name: 'cat_user', schema: 'public' })
export class CatUserEntity extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id_cat_user?: number;

  @Column()
  email!: string;

  @Column()
  user_name!: string;

  @Column()
  password!: string;

  @Column({ default: true })
  status: boolean = true;
  
  @OneToMany(type => CatClientEntity, (catClient: CatClientEntity) => catClient.cat_user)
  cat_client?: CatClientEntity[];
  
  @OneToMany(type => CatEmployeeEntity, (catEmployee: CatEmployeeEntity) => catEmployee.cat_user)
  cat_employee?: CatEmployeeEntity[];

  @OneToMany(type => DetailUserRoleEntity, (detailUserRole: DetailUserRoleEntity) => detailUserRole.cat_user)
  detail_user_role!: DetailUserRoleEntity[];
}
