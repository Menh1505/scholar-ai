import { Injectable, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { DatabaseService } from '../database/database.service';
import { Profile, ProfileSchema } from './schemas/profile.schema';

@Injectable()
export class ProfileService implements OnModuleInit {
  private profileModel: Model<Profile>;

  constructor(private readonly databaseService: DatabaseService) { }

  async onModuleInit() {
    // Wait for database connection to be established
    const connection = this.databaseService.getConnection();
    this.profileModel = connection.model<Profile>('Profile', ProfileSchema);
  }

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const profile = new this.profileModel(createProfileDto);
    return await profile.save();
  }

  async findAll(): Promise<Profile[]> {
    return await this.profileModel.find({ isActive: true }).exec();
  }

  async findOne(id: string): Promise<Profile | null> {
    return await this.profileModel.findById(id).exec();
  }

  async update(id: string, updateProfileDto: UpdateProfileDto): Promise<Profile | null> {
    return await this.profileModel.findByIdAndUpdate(id, updateProfileDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Profile | null> {
    return await this.profileModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
  }

  async hardDelete(id: string): Promise<any> {
    return await this.profileModel.findByIdAndDelete(id).exec();
  }
}
