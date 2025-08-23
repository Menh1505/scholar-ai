import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards,
  Request,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { WalletService } from './wallet.service';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly userService: UserService,
  ) {}

  /**
   * Lấy thông tin ví của người dùng hiện tại
   */
  @Get('info')
  async getWalletInfo(@Request() req) {
    try {
      const userId = req.user.userId;
      const wallet = await this.userService.getUserWallet(userId);
      
      if (!wallet) {
        throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: wallet,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get wallet info',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Lấy balance của ví người dùng
   */
  @Get('balance')
  async getWalletBalance(@Request() req) {
    try {
      const userId = req.user.userId;
      const balance = await this.userService.getUserWalletBalance(userId);
      
      if (balance === null) {
        throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: {
          balance: balance,
          currency: 'SEI',
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get wallet balance',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Gửi SEI từ ví người dùng đến địa chỉ khác
   */
  @Post('send')
  async sendSei(
    @Request() req,
    @Body() body: { toAddress: string; amount: string }
  ) {
    try {
      const userId = req.user.userId;
      const { toAddress, amount } = body;

      if (!toAddress || !amount) {
        throw new HttpException(
          'toAddress and amount are required',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Lấy private key của người dùng
      const privateKey = await this.userService.getUserPrivateKey(userId);
      if (!privateKey) {
        throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
      }

      // Gửi giao dịch
      const txHash = await this.walletService.sendSei(
        privateKey,
        toAddress,
        amount,
      );

      return {
        success: true,
        data: {
          transactionHash: txHash,
          toAddress,
          amount,
          currency: 'SEI',
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to send SEI',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Ký giao dịch cho người dùng
   */
  @Post('sign-transaction')
  async signTransaction(
    @Request() req,
    @Body() body: { transaction: any }
  ) {
    try {
      const userId = req.user.userId;
      const { transaction } = body;

      if (!transaction) {
        throw new HttpException(
          'transaction is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Lấy private key của người dùng
      const privateKey = await this.userService.getUserPrivateKey(userId);
      if (!privateKey) {
        throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
      }

      // Ký giao dịch
      const signedTx = await this.walletService.signTransaction(
        privateKey,
        transaction,
      );

      return {
        success: true,
        data: {
          signedTransaction: signedTx,
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to sign transaction',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Lấy thông tin network
   */
  @Get('network-info')
  async getNetworkInfo() {
    try {
      const networkInfo = this.walletService.getNetworkInfo();
      
      return {
        success: true,
        data: networkInfo,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get network info',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
