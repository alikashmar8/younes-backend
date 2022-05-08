import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateBusinessDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Business name',
    example: 'Younes',
    maxLength: 50,
  })
  @Length(1, 50)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Business logo',
    example: 'logo.png',
  })
  @IsOptional()
  logo: any;
}
