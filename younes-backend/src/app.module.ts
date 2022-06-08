import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BusinessesModule } from './businesses/businesses.module';
import { GalleryItemsModule } from './gallery-items/gallery-items.module';
import { UsersModule } from './users/users.module';
import { FavoriteModule } from './favorite/favorite.module';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from './s3/s3.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(
      // docker settings
      //   {
      //   type: 'mysql',
      //   host: 'younes_db',
      //   port: 3306,
      //   username: 'younes',
      //   password: 'P@ssw0rd',
      //   database: 'younes_db',
      //   synchronize: true,
      //   logging: false,
      //   entities: ['dist/**/*.entity{.ts,.js}'],
      //   migrations: ['src/migrations/**/*.ts'],
      // }
      //   {
      //   type: 'mysql',
      //   host: '52.213.53.168',
      //   port: 3306,
      //   username: 'admin',
      //   password: 'admin',
      //   database: 'younes_db',
      //   synchronize: true,
      //   logging: false,
      //   entities: ['dist/**/*.entity{.ts,.js}'],
      //   migrations: ['src/migrations/**/*.ts'],
      // }
      {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'younes_db',
        synchronize: true,
        logging: false,
        entities: ['dist/**/*.entity{.ts,.js}'],
        migrations: ['src/migrations/**/*.ts'],
      },
    ),
    AwsSdkModule.forRoot({
      defaultServiceOptions: {
        region: process.env['REGION'],
      },
      services: [S3],
    }),
    BusinessesModule,
    UsersModule,
    AuthModule,
    GalleryItemsModule,
    FavoriteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
