import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import { extname } from 'path';
import { generateFileUniqueName } from 'src/utilities/functions';

@Injectable()
export class S3Service {
  constructor(
    private readonly configService: ConfigService,
    @InjectAwsService(S3) private readonly s3: S3,
  ) {}

  async s3FileUpload(file: any, filepath: string): Promise<string> {
    const randomName = generateFileUniqueName();
    const fileName = `${randomName}${extname(file.originalname)}`;

    const urlKey = `${filepath}/${fileName}`;
    const params: S3.PutObjectRequest = {
      Body: file.buffer,
      Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
      Key: urlKey,
    };

    const data: S3.ManagedUpload.SendData = await this.s3
      .upload(params)
      .promise()
      .then(
        (data) => {
          return data;
        },
        (err) => {
          console.log('S3 upload error:');
          console.log(err);

          throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        },
      );

    return data.Location;
  }

  async s3FileDelete(filePath: string): Promise<void> {
    const params: S3.DeleteObjectRequest = {
      Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
      Key: filePath.split(`.com/`)[1],
    };

    await this.s3
      .deleteObject(params)
      .promise()
      .then(
        (data) => {},
        (err) => {
          console.log('S3 delete error:');
          console.log(err);
          throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        },
      );
  }
}
