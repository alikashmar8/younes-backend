import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';

@Controller('favorite')
@UseGuards(new AuthGuard())
@UsePipes(new ValidationPipe())
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  async create(@Body() createFavoriteDto: CreateFavoriteDto) {
    return await this.favoriteService.create(createFavoriteDto);
  }

  @Get()
  async findAll(@CurrentUser() user: User) {
    return await this.favoriteService.findAll(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.favoriteService.findOne(id, user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFavoriteDto: UpdateFavoriteDto,
  ) {
    return await this.favoriteService.update(id, updateFavoriteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.favoriteService.remove(id, user);
  }
}
