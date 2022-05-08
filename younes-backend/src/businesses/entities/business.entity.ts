import { GalleryItem } from 'src/gallery-items/entities/gallery-item.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('businesses')
export class Business {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    nullable: true,
    default: null,
    type: 'varchar',
    length: 255,
    unique: true,
  })
  logo: string;

  @OneToMany((type) => User, (user) => user.business)
  users: User[];

  @OneToMany((type) => GalleryItem, (item) => item.business)
  galleryItems: GalleryItem[];
}
