import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument, UserSchema } from './schemas/user.schema';

@Injectable()
export class UserService implements OnModuleInit {
  private userModel: Model<UserDocument>;

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    // Add a small delay to ensure database connection is established
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      this.userModel = this.connection.model<UserDocument>('User', UserSchema);
    } catch (error) {
      console.error('Failed to initialize UserService:', error);
      throw error;
    }
  }

  private ensureModel() {
    if (!this.userModel) {
      throw new Error(
        'UserModel not initialized. Please wait for module initialization.',
      );
    }
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    this.ensureModel();
    const user = new this.userModel(createUserDto);
    return await user.save();
  }

  async findAll(): Promise<UserDocument[]> {
    this.ensureModel();
    return await this.userModel.find({ isActive: true }).exec();
  }

  async findOne(id: string): Promise<UserDocument | null> {
    this.ensureModel();
    return await this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    this.ensureModel();
    return await this.userModel.findOne({ email, isActive: true }).exec();
  }

  async findByPassportCode(passportCode: string): Promise<UserDocument | null> {
    this.ensureModel();
    return await this.userModel
      .findOne({ passportCode, isActive: true })
      .exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument | null> {
    this.ensureModel();
    return await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<UserDocument | null> {
    this.ensureModel();
    return await this.userModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();
  }

  async hardDelete(id: string): Promise<any> {
    this.ensureModel();
    return await this.userModel.findByIdAndDelete(id).exec();
  }

  async updateScholarPoints(
    id: string,
    points: number,
  ): Promise<UserDocument | null> {
    this.ensureModel();
    return await this.userModel
      .findByIdAndUpdate(id, { $inc: { scholarPoints: points } }, { new: true })
      .exec();
  }

  async getTopScholars(limit: number = 10): Promise<UserDocument[]> {
    this.ensureModel();
    return await this.userModel
      .find({ isActive: true })
      .sort({ scholarPoints: -1 })
      .limit(limit)
      .exec();
  }
}
