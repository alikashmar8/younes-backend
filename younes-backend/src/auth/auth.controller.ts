import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateSuperUserDTO } from './dtos/create-super-user.dto';
import { UserEmailLoginDto } from './dtos/emailLogin.dto';
import { registerDTO } from './dtos/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe())
  async emailLogin(@Body() user: UserEmailLoginDto): Promise<string> {
    return await this.authService.loginByEmail(user);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() user: registerDTO) {
    return await this.authService.register(user);
  }

  @Post('get-super-user-token')
  @UsePipes(new ValidationPipe())
  async createSuperUser(@Body() user: UserEmailLoginDto) {
    return await this.authService.getSuperUserAccessToken(user);
  }
}
