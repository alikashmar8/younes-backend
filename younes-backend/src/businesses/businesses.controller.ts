import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
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
@ApiBearerAuth('access_token')
@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  @UseGuards(new SuperAdminGuard())
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo'))
  create(
    @Body() createBusinessDto: CreateBusinessDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createBusinessDto.logo = file;
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
