import { GalleryItem } from './../gallery-items/entities/gallery-item.entity';
import * as bcrypt from 'bcryptjs';
import { Business } from 'src/businesses/entities/business.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BCRYPT_SALT } from '../common/constants';
import { UserRole } from '../common/enums/user-role.enum';
import { Favorite } from 'src/favorite/entities/favorite.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ default: UserRole.CUSTOMER })
  role: UserRole;

  @Column({ nullable: false })
  business_id?: string;

  @ManyToOne((type) => Business, (business) => business.users)
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @OneToMany((type) => GalleryItem, (item) => item.created_by)
  createdItems: GalleryItem[];

  @OneToMany((type) => GalleryItem, (item) => item.updated_by)
  updatedItems: GalleryItem[];

  @OneToMany((type) => Favorite, (fav) => fav.user)
  favoriteItems: Favorite[];

  @BeforeInsert()
  async hashPassword() {
    this.email = this.email.toLowerCase();
    this.password = await bcrypt.hash(this.password, BCRYPT_SALT);
  }
}
