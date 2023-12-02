
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CatClientEntity } from './cat-client.entity';
import { CatEmployeeEntity } from './cat-employee.entity';


@Entity({ name: 'cat_person', schema: 'public' })
export class CatPersonEntity extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id_cat_person?: number;

  @Column()
  name!: string;

  @Column()
  surname_father!: string;

  @Column()
  surname_mother!: string;

  @Column()
  phone_contact!: string;

  @Column()
  email_contact!: string;

  @Column({ type: 'date' })
  birth!: Date;

  @Column()
  gender!: string;

  @Column()
  street_address!: string;

  @Column()
  city!: string;

  @Column()
  state_province!: string;

  @Column()
  zip_code!: string;

  @Column()
  country!: string;

  @Column({ default: true })
  status: boolean = true;

  @ManyToOne(type => CatClientEntity, catClientEntity => catClientEntity.cat_person)
  @JoinColumn({name: "fk_cat_client"})
  cat_client!: CatClientEntity;

  @ManyToOne(type => CatEmployeeEntity, catEmployeeEntity => catEmployeeEntity.id_cat_employee)
  @JoinColumn({name: "fk_cat_employee"})
  cat_employee?: CatEmployeeEntity;
}
