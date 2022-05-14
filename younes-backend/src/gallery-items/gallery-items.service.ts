import { UpdateGalleryFolderDto } from './dto/update-gallery-folder.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GalleryItemType } from 'src/common/dtos/gallery-item-type.dto';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateGalleryFileDto } from './dto/create-gallery-file.dto';
import { CreateGalleryFolderDto } from './dto/create-gallery-folder.dto';
import { GalleryItem } from './entities/gallery-item.entity';
import { UpdateGalleryFileDto } from './dto/update-gallery-file.dto';

@Injectable()
export class GalleryItemsService {
  constructor(
    @InjectRepository(GalleryItem)
    private readonly galleryItemRepository: Repository<GalleryItem>,
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
    return await this.galleryItemRepository
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
  }

  async findAll(currentUser: User, parent_id?: string): Promise<GalleryItem[]> {
    let query: any = this.galleryItemRepository
      .createQueryBuilder('gallery_item')
      .where('gallery_item.business_id = :business_id', {
        business_id: currentUser.business_id,
      });
    if (parent_id) {
      query = query.andWhere('gallery_item.parent_id = :parent_id', {
        parent_id: parent_id,
      });
    }
    return await query.orderBy('gallery_item.type', 'DESC').getMany();
  }

  async findOne(
    id: string,
    currentUser: User,
    relation?: string[],
  ): Promise<GalleryItem> {
    return await this.galleryItemRepository
      .findOneOrFail({
        where: {
          id,
          business_id: currentUser.business_id,
        },
        relations: relation,
      })
      .catch((err) => {
        console.log(err);
        throw new BadRequestException('Error finding gallery item');
      });
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
    await this.findOne(id, currentUser);
    return await this.galleryItemRepository.delete(id).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error deleting item');
    });
  }
}
