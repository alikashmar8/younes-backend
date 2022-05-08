import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty, IsNumberString, IsOptional, Length
} from 'class-validator';

export class CreateGalleryFileDto {
  @IsNotEmpty()
  @Length(1, 50)
  @ApiProperty({
    type: String,
    required: true,
    description: 'Gallery file name',
    example: 'Younes',
    maxLength: 50,
  })
  name: string;

  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    nullable: true,
    description: 'Gallery file parent id',
    example: 'Younes',
    maxLength: 50,
  })
  parent_id?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Gallery file image',
    example: 'logo.png',
  })
  @IsOptional()
  image?: any;

  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
    description: 'Gallery file description',
    example: 'Younes',
    maxLength: 250,
  })
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
    description: 'Gallery file price',
    default: 0,
  })
  price?: number;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
    description: 'Gallery file quantity',
    default: 0,
  })
  quantity?: number;
}
