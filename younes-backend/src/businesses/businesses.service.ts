import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business } from './entities/business.entity';

@Injectable()
export class BusinessesService {
  constructor(
    @InjectRepository(Business)
    private businessesRepository: Repository<Business>,
  ) {}

  async create(createBusinessDto: CreateBusinessDto) {
    return await this.businessesRepository.save(createBusinessDto);
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
    return await this.businessesRepository.delete(id).catch(() => {
      throw new BadRequestException('Cannot delete business');
    });
  }
}
