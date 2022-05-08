import { Test, TestingModule } from '@nestjs/testing';
import { GalleryItemsService } from './gallery-items.service';

describe('GalleryItemsService', () => {
  let service: GalleryItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GalleryItemsService],
    }).compile();

    service = module.get<GalleryItemsService>(GalleryItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
