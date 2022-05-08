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

  @Column({})
  quantity?: number;

  @Column({})
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

  @ManyToOne((type) => GalleryItem, (galleryItem) => galleryItem.children)
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

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
