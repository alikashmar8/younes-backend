import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from 'src/favorite/entities/favorite.entity';
import { GalleryItem } from './entities/gallery-item.entity';
import { GalleryItemsController } from './gallery-items.controller';
import { GalleryItemsService } from './gallery-items.service';

@Module({
  imports: [TypeOrmModule.forFeature([GalleryItem, Favorite])],
  controllers: [GalleryItemsController],
  providers: [GalleryItemsService],
  exports: [GalleryItemsService],
})
export class GalleryItemsModule {}
