import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class StoreUserDTO {
    @IsNotEmpty()
    @ApiProperty()
    first_name: string;
  
    @IsNotEmpty()
    @ApiProperty()
    last_name: string;
  
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;
  
    @IsNotEmpty()
    @ApiProperty()
    password: string;
}