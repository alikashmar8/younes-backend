import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Service } from 'src/s3/s3.service';
import { Repository } from 'typeorm';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business } from './entities/business.entity';

@Injectable()
export class BusinessesService {
  constructor(
    @InjectRepository(Business)
    private businessesRepository: Repository<Business>,
    private s3Service: S3Service,
  ) {}

  async create(createBusinessDto: CreateBusinessDto) {
    const business = await this.businessesRepository
      .save({
        name: createBusinessDto.name,
      })
      .then(async (business) => {
        if (createBusinessDto.logo) {
          const fileLocation: string = await this.s3Service.s3FileUpload(
            createBusinessDto.logo,
            `businesses_logos`,
          );
          createBusinessDto.logo = fileLocation;
        }
        return business;
      });
  }

  async findAll() {
    return await this.businessesRepository.find();
  }

  async findOne(id: string) {
    return await this.businessesRepository.findOneOrFail(id).catch(() => {
      throw new BadRequestException('Business not found');
    });
  }

  async update(id: string, updateBusinessDto: UpdateBusinessDto) {
    return await this.businessesRepository.update(id, updateBusinessDto);
  }

  async remove(id: string) {
    const business = await this.findOne(id);
    let logo = business.logo;
    return await this.businessesRepository
      .delete(id)
      .then(async () => {
        if (logo) await this.s3Service.s3FileDelete(logo);
      })
      .catch(() => {
        throw new BadRequestException('Cannot delete business');
      });
  }
}
