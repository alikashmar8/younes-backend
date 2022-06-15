import { User } from './../../users/user.entity';
import { GalleryItemType } from './../../common/dtos/gallery-item-type.dto';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreateDateColumn } from 'typeorm';
import { ManyToOne } from 'typeorm';
import { JoinColumn } from 'typeorm';
import { Business } from 'src/businesses/entities/business.entity';
import { Favorite } from 'src/favorite/entities/favorite.entity';

@Entity('gallery-items')
export class GalleryItem {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    type: 'enum',
    nullable: false,
    unique: false,
    enum: GalleryItemType,
  })
  type: string;

  @Column({
    nullable: true,
  })
  image?: string;

  @Column({
    nullable: true,
  })
  description?: string;

  @Column({
    default: true,
  })
  is_active?: boolean;

  @Column({
    default: 1,
  })
  quantity?: number;

  @Column({
    type: 'double',
    default: 0,
  })
  price?: number;

  @Column({
    nullable: true,
    unique: false,
  })
  parent_id: string;

  @Column({
    nullable: false,
  })
  business_id: string;

  @Column({
    nullable: false,
  })
  created_by_id: string;

  @Column({
    nullable: true,
    unique: false,
  })
  updated_by_id: string;

  @OneToMany((type) => GalleryItem, (galleryItem) => galleryItem.parent)
  children: GalleryItem[];

  @ManyToOne((type) => GalleryItem, (galleryItem) => galleryItem.children, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'parent_id',
  })
  parent: GalleryItem;

  @ManyToOne((type) => User, (user) => user.createdItems)
  @JoinColumn({
    name: 'created_by_id',
  })
  created_by: User;

  @ManyToOne((type) => User, (user) => user.updatedItems)
  @JoinColumn({
    name: 'updated_by_id',
  })
  updated_by: User;

  @ManyToOne((type) => Business, (business) => business.galleryItems)
  @JoinColumn({
    name: 'business_id',
  })
  business: Business;

  @OneToMany((type) => Favorite, (favorite) => favorite.item)
  favorites: Favorite[];

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
