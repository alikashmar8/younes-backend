import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length, IsOptional } from "class-validator";

export class CreateGalleryFolderDto {
    @IsNotEmpty()
    @Length(1, 50)
    @ApiProperty({
        type: String,
        required: true,
        description: 'Gallery folder name',
        example: 'Younes',
        maxLength: 50,
    })
    name: string;

    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        nullable: true,
        description: 'Gallery folder parent id',
        example: 'Younes',
        maxLength: 50,
    })
    parent_id: string;
}
