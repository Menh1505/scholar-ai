import { Injectable } from '@nestjs/common';
import { CreateLegalDto } from './dto/create-legal.dto';
import { UpdateLegalDto } from './dto/update-legal.dto';

@Injectable()
export class LegalService {
  create(createLegalDto: CreateLegalDto) {
    return 'This action adds a new legal';
  }

  findAll() {
    return `This action returns all legal`;
  }

  findOne(id: number) {
    return `This action returns a #${id} legal`;
  }

  update(id: number, updateLegalDto: UpdateLegalDto) {
    return `This action updates a #${id} legal`;
  }

  remove(id: number) {
    return `This action removes a #${id} legal`;
  }
}
