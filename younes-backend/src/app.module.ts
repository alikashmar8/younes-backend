import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BusinessesModule } from './businesses/businesses.module';
import { GalleryItemsModule } from './gallery-items/gallery-items.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'younes_db',
      port: 3306,
      username: 'younes',
      password: 'P@ssw0rd',
      database: 'younes_db',
      synchronize: true,
      logging: false,
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['src/migrations/**/*.ts'],
    }),
    BusinessesModule,
    UsersModule,
    AuthModule,
    GalleryItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
