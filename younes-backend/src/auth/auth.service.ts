import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from 'src/common/constants';
import { UserRole } from 'src/common/enums/user-role.enum';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateSuperUserDTO } from './dtos/create-super-user.dto';
import { UserEmailLoginDto } from './dtos/emailLogin.dto';
import { registerDTO } from './dtos/register.dto';

@Injectable()
export class AuthService {
  async getSuperUserAccessToken(data: CreateSuperUserDTO) {
    if (data.email === 'admin@younes.com' && data.password === 'P@ssw0rd') {
      const payload = {
        email: data.email,
        role: UserRole.SUPER_USER,
        name: 'SUPER USER',
      };
      const token = await jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
      return { access_token: token };
    } else {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async loginByEmail(dto: UserEmailLoginDto): Promise<string> {
    let { email, password } = dto;
    let user: any = await this.usersRepository
      .createQueryBuilder('user')
      .where(`user.email = '${email}'`)
      .getOne();
    if (!user) {
      throw new HttpException(
        'No user with this email found',
        HttpStatus.BAD_REQUEST,
      );
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = jwt.sign({ user }, JWT_SECRET, {
        expiresIn: '4h',
      });
      user.access_token = token;
      return user;
    } else {
      throw new HttpException('Password Incorrect', HttpStatus.BAD_REQUEST);
    }
  }
  async register(user: registerDTO): Promise<User> {
    const u = this.usersRepository.create(user);
    return await this.usersRepository.save(u);
  }
}
