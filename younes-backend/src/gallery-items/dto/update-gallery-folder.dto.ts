import { PartialType } from '@nestjs/swagger';
import { CreateGalleryFolderDto } from './create-gallery-folder.dto';

export class UpdateGalleryFolderDto extends PartialType(CreateGalleryFolderDto) {}
