
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { CatRoomEntity } from './cat-room.entity';


@Entity({ name: 'cat_room_status', schema: 'public' })
export class CatRoomStatusEntity extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id_cat_room_status?: number;

  @Column()
  dirty!: boolean;

  @Column()
  busy!: boolean;

  @Column({ default: true })
  status: boolean = true;

  @OneToMany(type => CatRoomEntity, catRoomEntity => catRoomEntity.cat_room_status)
  cat_room_status!: CatRoomStatusEntity[];
}
