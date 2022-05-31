import { GalleryItem } from './../gallery-items/entities/gallery-item.entity';
import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoritesRepository: Repository<Favorite>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(GalleryItem)
    private readonly itemsRepository: Repository<GalleryItem>,
  ) {}
  async create(createFavoriteDto: CreateFavoriteDto) {
    const user: User = await this.usersRepository
      .findOneOrFail(createFavoriteDto.user_id)
      .catch((error) => {
        console.log(error);
        throw new BadGatewayException('User not found');
      });
    const item = await this.itemsRepository
      .findOneOrFail(createFavoriteDto.item_id)
      .catch((error) => {
        console.log(error);
        throw new BadGatewayException('Item not found');
      });

    if (user.business_id !== item.business_id) {
      throw new ForbiddenException(
        'User and item are not from the same business',
      );
    }

    var exists = await this.favoritesRepository.findOne({
      where: {
        user_id: createFavoriteDto.user_id,
        item_id: createFavoriteDto.item_id,
      },
    });

    if (exists) throw new ForbiddenException('Item already set as favorite');

    const favorite = new Favorite();
    favorite.user = user;
    favorite.item = item;
    return await this.favoritesRepository.save(favorite).catch((error) => {
      console.log(error);
      throw new BadRequestException('Error saving favorite');
    });
  }

  async findAll(user_id:string) {
    return await this.favoritesRepository.find({
      where:{
        user_id        
      }
    });
  }

  async findOne(id: string, currentUser: User) {
    const fav = await this.favoritesRepository.findOne(id);
    if (fav.user_id != currentUser.id) {
      throw new ForbiddenException('You don\'t have permission to access this');
    }
    return fav;
  }

  async update(id: string, updateFavoriteDto: UpdateFavoriteDto) {
    const user: User = await this.usersRepository
      .findOneOrFail(updateFavoriteDto.user_id)
      .catch((error) => {
        console.log(error);
        throw new BadGatewayException('User not found');
      });
    const item = await this.itemsRepository
      .findOneOrFail(updateFavoriteDto.item_id)
      .catch((error) => {
        console.log(error);
        throw new BadGatewayException('Item not found');
      });

    if (user.business_id !== item.business_id) {
      throw new ForbiddenException(
        'User and item are not from the same business',
      );
    }
    return await this.favoritesRepository.update(id, updateFavoriteDto);
  }

  async remove(id: string, currentUser: User) {
    const fav = await this.findOne(id, currentUser);
    return await this.favoritesRepository.delete(id).catch((error)=>{
      throw new BadRequestException('')
    })
  }
}
