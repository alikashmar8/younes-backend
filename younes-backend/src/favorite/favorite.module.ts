import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalleryItem } from 'src/gallery-items/entities/gallery-item.entity';
import { User } from 'src/users/user.entity';
import { Favorite } from './entities/favorite.entity';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, GalleryItem, Favorite])],
  controllers: [FavoriteController],
  providers: [FavoriteService],
})
export class FavoriteModule {}
