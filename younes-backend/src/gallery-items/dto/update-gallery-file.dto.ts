import { PartialType } from '@nestjs/swagger';
import { CreateGalleryFileDto } from './create-gallery-file.dto';

export class UpdateGalleryFileDto extends PartialType(CreateGalleryFileDto) {}
