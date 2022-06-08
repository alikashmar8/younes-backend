import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GalleryItemType } from 'src/common/dtos/gallery-item-type.dto';
import { Favorite } from 'src/favorite/entities/favorite.entity';
import { S3Service } from 'src/s3/s3.service';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateGalleryFileDto } from './dto/create-gallery-file.dto';
import { CreateGalleryFolderDto } from './dto/create-gallery-folder.dto';
import { UpdateGalleryFileDto } from './dto/update-gallery-file.dto';
import { UpdateGalleryFolderDto } from './dto/update-gallery-folder.dto';
import { GalleryItem } from './entities/gallery-item.entity';

@Injectable()
export class GalleryItemsService {
  constructor(
    @InjectRepository(GalleryItem)
    private readonly galleryItemRepository: Repository<GalleryItem>,
    @InjectRepository(Favorite)
    private readonly favoritesRepository: Repository<Favorite>,
    private s3Service: S3Service,
  ) {}

  async createFolder(
    data: CreateGalleryFolderDto,
    currentUser: User,
  ): Promise<GalleryItem> {
    return await this.galleryItemRepository
      .save({
        ...data,
        type: GalleryItemType.FOLDER,
        is_active: true,
        business_id: currentUser.business_id,
        created_by_id: currentUser.id,
      })
      .catch((err) => {
        console.log(err);
        throw new BadRequestException('Error creating folder');
      });
  }

  async createFile(
    data: CreateGalleryFileDto,
    currentUser: User,
  ): Promise<GalleryItem> {
    let item = await this.galleryItemRepository
      .save({
        ...data,
        type: GalleryItemType.FILE,
        is_active: true,
        business_id: currentUser.business_id,
        created_by_id: currentUser.id,
      })
      .catch((err) => {
        console.log(err);
        throw new BadRequestException('Error creating file');
      });

    const fileLocation: string = await this.s3Service.s3FileUpload(
      data.image,
      `items/${item.id}`,
    );

    await this.galleryItemRepository.update(item.id, {
      image: fileLocation,
    });

    return item;
  }

  async findAll(currentUser: User, parent_id?: string) {
    let query: any = this.galleryItemRepository
      .createQueryBuilder('gallery_item')
      .leftJoinAndSelect('gallery_item.favorites', 'favorites')
      .where('gallery_item.business_id = :business_id', {
        business_id: currentUser.business_id,
      });
    if (parent_id) {
      query = query.andWhere('gallery_item.parent_id = :parent_id', {
        parent_id: parent_id,
      });
    } else {
      query = query.andWhere('gallery_item.parent_id IS NULL');
    }
    let res = await query.orderBy('gallery_item.type', 'DESC').getMany();
    res.forEach((item) => {
      item.is_favorite = item.favorites.find(
        (fav) => fav.user_id === currentUser.id,
      )
        ? true
        : false;
    });
    return res;
  }

  async findAllFavorites(currentUser: User) {
    let res = await this.galleryItemRepository
      .createQueryBuilder('gallery_item')
      .innerJoinAndSelect('gallery_item.favorites', 'favorites')
      .where('favorites.user_id = :user_id', {
        user_id: currentUser.id,
      })
      .where('gallery_item.business_id = :business_id', {
        business_id: currentUser.business_id,
      })
      .orderBy('gallery_item.type', 'DESC')
      .getMany();
    res.forEach((item: any) => {
      item.is_favorite = item.favorites.find(
        (fav) => fav.user_id === currentUser.id,
      )
        ? true
        : false;
    });
    return res;
  }

  async findOne(id: string, currentUser: User, relation: string[] = []) {
    let res: any = await this.galleryItemRepository
      .findOneOrFail({
        where: {
          id,
          business_id: currentUser.business_id,
        },
        relations: ['favorites', ...relation],
      })
      .catch((err) => {
        console.log(err);
        throw new BadRequestException('Error finding gallery item');
      });
    res.is_favorite = res.favorites.find(
      (fav) => fav.user_id === currentUser.id,
    )
      ? true
      : false;
    return res;
  }

  async updateFolder(
    id: string,
    data: UpdateGalleryFolderDto,
    currentUser: User,
  ) {
    const galleryFolder = await this.findOne(id, currentUser);
    return await this.galleryItemRepository.update(id, {
      ...data,
      updated_by_id: currentUser.id,
    });
  }

  async updateFile(id: string, data: UpdateGalleryFileDto, currentUser: User) {
    await this.findOne(id, currentUser);
    return await this.galleryItemRepository.update(id, {
      ...data,
      updated_by_id: currentUser.id,
    });
  }

  async remove(id: string, currentUser: User) {
    const item = await this.findOne(id, currentUser);
    if (item.type === GalleryItemType.FILE)
      await this.s3Service.s3FileDelete(item.image);
    return await this.galleryItemRepository.delete(id).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error deleting item');
    });
  }

  async sell(id: string, quantity: any, user: User) {
    quantity = Number(quantity);
    const galleryItem = await this.findOne(id, user);
    if (galleryItem.quantity < quantity) {
      throw new BadRequestException('Not enough quantity');
    }
    galleryItem.quantity -= quantity;
    galleryItem.updated_by_id = user.id;
    return await this.galleryItemRepository.save(galleryItem);
  }

  async unFavoriteItem(id: string, currentUser: User) {
    return await this.favoritesRepository.delete({
      user_id: currentUser.id,
      item_id: id,
    });
  }
  async makeItemFavorite(id: string, currentUser: User) {
    const item = await this.findOne(id, currentUser);
    const isFavorite = await this.favoritesRepository.findOne({
      where: {
        user_id: currentUser.id,
        item_id: id,
      },
    });
    if (isFavorite) {
      throw new BadRequestException('Item is already a favorite');
    }
    return await this.favoritesRepository.save({
      user_id: currentUser.id,
      item_id: id,
    });
  }
}
