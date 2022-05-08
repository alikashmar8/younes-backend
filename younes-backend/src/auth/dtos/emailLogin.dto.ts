import { ApiProperty } from '@nestjs/swagger';
import { Length, IsEmail, IsNotEmpty } from 'class-validator';

export class UserEmailLoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    description: 'Email',
    example: 'user@email.com',
  })
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Password',
    example: '123456',
    minLength: 6,
    maxLength: 16,
  })
  @Length(6, 16)
  @IsNotEmpty()
  password: string;
}
