import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLegalDto } from './dto/create-legal.dto';
import { UpdateLegalDto } from './dto/update-legal.dto';
import { LegalDocument } from './schemas/legal.schema';

@Injectable()
export class LegalService {
  constructor(@InjectModel('Legal') private legalModel: Model<LegalDocument>) {}

  async create(createLegalDto: CreateLegalDto): Promise<LegalDocument> {
    const createdLegal = new this.legalModel(createLegalDto);
    return createdLegal.save();
  }

  async findOne(id: string): Promise<LegalDocument> {
    const legal = await this.legalModel.findById(id).exec();
    if (!legal) {
      throw new NotFoundException(`Legal document with ID ${id} not found`);
    }
    return legal;
  }

  async findByUserId(userId: string): Promise<LegalDocument[]> {
    return this.legalModel.find({ userId }).exec();
  }

  async update(
    id: string,
    updateLegalDto: UpdateLegalDto,
  ): Promise<LegalDocument> {
    const updatedLegal = await this.legalModel
      .findByIdAndUpdate(id, updateLegalDto, { new: true })
      .exec();
    if (!updatedLegal) {
      throw new NotFoundException(`Legal document with ID ${id} not found`);
    }
    return updatedLegal;
  }

  async remove(id: string): Promise<void> {
    const result = await this.legalModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Legal document with ID ${id} not found`);
    }
  }
}
