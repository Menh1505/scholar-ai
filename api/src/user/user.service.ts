import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument, UserSchema } from './schemas/user.schema';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class UserService implements OnModuleInit {
  private userModel: Model<UserDocument>;

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly walletService: WalletService,
  ) {}

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
    
    // Tạo ví mới cho người dùng
    const walletInfo = await this.walletService.createWallet();
    const networkInfo = this.walletService.getNetworkInfo();
    
    // Mã hóa private key
    const encryptedPrivateKey = this.walletService.encryptPrivateKey(
      walletInfo.privateKey,
      createUserDto.email // Sử dụng email làm password tạm thời
    );

    // Thêm thông tin ví vào user data
    const userDataWithWallet = {
      ...createUserDto,
      wallet: {
        address: walletInfo.address,
        encryptedPrivateKey: encryptedPrivateKey,
        publicKey: walletInfo.publicKey,
        networkInfo: {
          chainId: networkInfo.chainId,
          currency: networkInfo.currency,
          networkName: networkInfo.networkName,
        },
        createdAt: new Date(),
      },
    };

    const user = new this.userModel(userDataWithWallet);
    return await user.save();
  }

  async findOne(id: string): Promise<UserDocument | null> {
    this.ensureModel();
    return await this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    this.ensureModel();
    return await this.userModel.findOne({ email, isActive: true }).exec();
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

  /**
   * Lấy thông tin ví của người dùng
   */
  async getUserWallet(userId: string) {
    this.ensureModel();
    const user = await this.userModel.findById(userId).exec();
    
    if (!user || !user.wallet) {
      return null;
    }

    return {
      address: user.wallet.address,
      publicKey: user.wallet.publicKey,
      networkInfo: user.wallet.networkInfo,
      createdAt: user.wallet.createdAt,
    };
  }

  /**
   * Lấy private key đã giải mã của người dùng (chỉ dùng cho server-side operations)
   */
  async getUserPrivateKey(userId: string): Promise<string | null> {
    this.ensureModel();
    const user = await this.userModel.findById(userId).exec();
    
    if (!user || !user.wallet) {
      return null;
    }

    try {
      const privateKey = this.walletService.decryptPrivateKey(
        user.wallet.encryptedPrivateKey,
        user.email // Sử dụng email làm password
      );
      return privateKey;
    } catch (error) {
      console.error('Failed to decrypt private key:', error);
      return null;
    }
  }

  /**
   * Lấy balance của ví người dùng
   */
  async getUserWalletBalance(userId: string): Promise<string | null> {
    const wallet = await this.getUserWallet(userId);
    if (!wallet) {
      return null;
    }

    try {
      const balance = await this.walletService.getBalance(wallet.address);
      return balance;
    } catch (error) {
      console.error('Failed to get wallet balance:', error);
      return null;
    }
  }
}
