import { Test, TestingModule } from '@nestjs/testing';
import { GalleryItemsController } from './gallery-items.controller';
import { GalleryItemsService } from './gallery-items.service';

describe('GalleryItemsController', () => {
  let controller: GalleryItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GalleryItemsController],
      providers: [GalleryItemsService],
    }).compile();

    controller = module.get<GalleryItemsController>(GalleryItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
