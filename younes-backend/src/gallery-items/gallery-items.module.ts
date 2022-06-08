import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from 'src/favorite/entities/favorite.entity';
import { S3Service } from 'src/s3/s3.service';
import { GalleryItem } from './entities/gallery-item.entity';
import { GalleryItemsController } from './gallery-items.controller';
import { GalleryItemsService } from './gallery-items.service';

@Module({
  imports: [TypeOrmModule.forFeature([GalleryItem, Favorite])],
  controllers: [GalleryItemsController],
  providers: [GalleryItemsService, S3Service],
  exports: [GalleryItemsService],
})
export class GalleryItemsModule {}
