import {
  Body,
  Controller,
  Delete, ForbiddenException, Get,
  Param,
  Patch,
  Post,
  UploadedFile, UseGuards, UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage, FileFilterCallback } from 'multer';
import { basename, extname } from 'path';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { SuperAdminGuard } from 'src/auth/guards/super-admin.guard';
import { BUSINESS_LOGO_PATH } from 'src/common/constants';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@ApiTags('businesses')
@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  // @UseGuards(new SuperAdminGuard())
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('logo', {
      preservePath: true,
      storage: diskStorage({
        destination: BUSINESS_LOGO_PATH,
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${basename(file.originalname)}-${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb: FileFilterCallback) => {
        const acceptedExtensions = [
          'image/jpg',
          'image/jpeg',
          'image/png',
          'image/svg',
        ];
        if (!acceptedExtensions.includes(file.mimetype)) {
          const error = new Error('Invalid file type');
          return cb(null, false);
        }
        cb(null, true);
      },

      limits: {
        fileSize: 1024 * 1024 * 5,
      },
    }),
  )
  create(
    @Body() createBusinessDto: CreateBusinessDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createBusinessDto.logo = BUSINESS_LOGO_PATH + file.filename;
    } else {
      createBusinessDto.logo = null;
    }
    return this.businessesService.create(createBusinessDto);
  }

  @Get()
  @UseGuards(new AuthGuard())
  findAll() {
    return this.businessesService.findAll();
  }

  @Get(':id')
  @UseGuards(new AuthGuard())
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    if (user.business_id != id)
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    return this.businessesService.findOne(id);
  }

  @UseGuards(new AuthGuard())
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
    @CurrentUser() user: User,
  ) {
    if (user.business_id != id)
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    return this.businessesService.update(id, updateBusinessDto);
  }

  @UseGuards(new AuthGuard())
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    if (user.business_id != id)
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    return this.businessesService.remove(id);
  }
}
