import { GalleryItem } from 'src/gallery-items/entities/gallery-item.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('favorites')
export class Favorite {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    nullable: false,
  })
  user_id: string;

  @Column({
    nullable: false,
  })
  item_id: string;

  @ManyToOne((type) => User, (user) => user.favoriteItems)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne((type) => GalleryItem, (item) => item.favorites)
  @JoinColumn({ name: 'item_id' })
  item: GalleryItem;
}
