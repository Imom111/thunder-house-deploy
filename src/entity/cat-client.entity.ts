
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CatUserEntity } from './cat-user.entity';
import { CatPersonEntity } from './cat-person.entity';


@Entity({ name: 'cat_client', schema: 'public' })
export class CatClientEntity extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id_cat_client?: number;

  @ManyToOne(type => CatUserEntity, catUserEntity => catUserEntity.cat_client)
  @JoinColumn({name: "fk_cat_user"})
  cat_user!: CatUserEntity;

  @OneToMany(type => CatPersonEntity, catPersonEntity => catPersonEntity.cat_client)
  cat_person!: CatPersonEntity[];
}
