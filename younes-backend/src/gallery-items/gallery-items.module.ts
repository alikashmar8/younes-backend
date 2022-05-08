import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalleryItem } from './entities/gallery-item.entity';
import { GalleryItemsController } from './gallery-items.controller';
import { GalleryItemsService } from './gallery-items.service';

@Module({
  imports: [TypeOrmModule.forFeature([GalleryItem])],
  controllers: [GalleryItemsController],
  providers: [GalleryItemsService],
  exports: [GalleryItemsService],
})
export class GalleryItemsModule {}
