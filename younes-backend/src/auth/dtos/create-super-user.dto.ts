import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail, IsNotEmpty, Length
} from 'class-validator';

export class CreateSuperUserDTO {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: String })
  email: string;

  @IsNotEmpty()
  @Length(8, 16)
  @ApiProperty({ type: String })
  password: string;
}
