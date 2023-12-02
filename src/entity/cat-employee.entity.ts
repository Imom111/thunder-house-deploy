
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CatUserEntity } from './cat-user.entity';


@Entity({ name: 'cat_employee', schema: 'public' })
export class CatEmployeeEntity extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id_cat_employee?: number;

  @ManyToOne(type => CatUserEntity, catUserEntity => catUserEntity.id_cat_user)
  @JoinColumn({name: "fk_cat_user"})
  cat_user!: CatUserEntity;
}
