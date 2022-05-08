import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';
import { UserRole } from 'src/common/enums/user-role.enum';

export class registerDTO {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: String })
  email: string;

  @IsNotEmpty()
  @Length(8, 16)
  @ApiProperty({ type: String })
  password: string;

  @IsNotEmpty()
  @Length(1, 50)
  @ApiProperty({ type: String })
  name: string;

  @IsOptional()
  @ApiProperty({ type: String })
  business_id: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Invalid role', each: true })
  @ApiProperty({
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.CUSTOMER,
  })
  role: UserRole;
}
