import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param, Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GALLERY_FILES_IMAGES_PATH } from 'src/common/constants';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { CreateGalleryFileDto } from './dto/create-gallery-file.dto';
import { CreateGalleryFolderDto } from './dto/create-gallery-folder.dto';
import { UpdateGalleryFileDto } from './dto/update-gallery-file.dto';
import { UpdateGalleryFolderDto } from './dto/update-gallery-folder.dto';
import { GalleryItemsService } from './gallery-items.service';

@ApiTags('Gallery Items')
@ApiBearerAuth('access_token')
@UsePipes(new ValidationPipe())
@UseGuards(new AuthGuard())
@Controller('gallery-items')
export class GalleryItemsController {
  constructor(private readonly galleryItemsService: GalleryItemsService) {}

  @Post('folders')
  async createFolders(
    @Body() createGalleryItemDto: CreateGalleryFolderDto,
    @CurrentUser() user: User,
  ) {
    return await this.galleryItemsService.createFolder(
      createGalleryItemDto,
      user,
    );
  }

  @Post('files')
  @UseInterceptors(
    FileInterceptor('image', {
      preservePath: true,
      storage: diskStorage({
        destination: GALLERY_FILES_IMAGES_PATH,
        filename: (req, file, cb) => {
          console.log('using image file name');
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  async createFiles(
    @Body() createGalleryItemDto: CreateGalleryFileDto,
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('checking if file exists in controller');

    if (file) {
      console.log('file found in if');
      createGalleryItemDto.image = GALLERY_FILES_IMAGES_PATH + file.filename;
    } else {
      console.log('file not received in controller');
      throw new BadRequestException('No image was uploaded');
    }
    return await this.galleryItemsService.createFile(
      createGalleryItemDto,
      user,
    );
  }

  @Get()
  @UseGuards(new AuthGuard())
  async findAll(
    @CurrentUser() user: User,
    @Query('parent_id') parent_id?: string,
  ) {
    return await this.galleryItemsService.findAll(user, parent_id);
  }

  @Get('favorites')
  @UseGuards(new AuthGuard())
  async findAllFavorites(
    @CurrentUser() user: User,
  ) {
    return await this.galleryItemsService.findAllFavorites(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.galleryItemsService.findOne(id, user, [
      'parent',
      'children',
      'created_by',
      'updated_by',
    ]);
  }

  @Put(':id/make-favorite')
  async makeItemFavorite(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.galleryItemsService.makeItemFavorite(id, user);
  }

  @Put(':id/unfavorite')
  async unfavoriteItem(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.galleryItemsService.unFavoriteItem(id, user);
  }

  @Put('folders/:id')
  updateFolder(
    @Param('id') id: string,
    @Body() updateGalleryItemDto: UpdateGalleryFolderDto,
    @CurrentUser() user: User,
  ) {
    return this.galleryItemsService.updateFolder(
      id,
      updateGalleryItemDto,
      user,
    );
  }

  @Put('files/:id')
  updateFile(
    @Param('id') id: string,
    @Body() updateGalleryItemDto: UpdateGalleryFileDto,
    @CurrentUser() user: User,
  ) {
    return this.galleryItemsService.updateFile(id, updateGalleryItemDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.galleryItemsService.remove(id, user);
  }

  @Post(':id/sell')
  async sell(
    @Param('id') id: string,
    @Body() body: any,
    @CurrentUser() user: User,
  ) {
    if (!body.quantity) {
      throw new BadRequestException('quantity is required');
    }
    return await this.galleryItemsService.sell(id, body.quantity, user);
  }
}
