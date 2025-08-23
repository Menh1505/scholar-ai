import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { Secp256k1, Secp256k1Signature, sha256 } from '@cosmjs/crypto';
import { bech32 } from 'bech32';

export interface WalletInfo {
  address: string;
  privateKey: string;
  publicKey: string;
  mnemonic?: string;
}

@Injectable()
export class WalletService {
  private readonly seiRpcUrl = 'wss://evm-ws-testnet.sei-apis.com';
  private readonly chainId = 1328; // 0x530
  private readonly currency = 'SEI';

  constructor(private configService: ConfigService) {}

  /**
   * Tạo ví mới cho người dùng
   */
  async createWallet(): Promise<WalletInfo> {
    try {
      // Tạo wallet ngẫu nhiên
      const wallet = ethers.Wallet.createRandom();
      
      // Lấy private key và public key
      const privateKey = wallet.privateKey;
      const publicKey = wallet.publicKey;
      const address = wallet.address;
      const mnemonic = wallet.mnemonic?.phrase;

      // Tạo địa chỉ Sei bech32 format (optional, nếu cần)
      const seiAddress = this.convertToSeiAddress(publicKey);

      return {
        address: address, // EVM address
        privateKey: privateKey,
        publicKey: publicKey,
        mnemonic: mnemonic
      };
    } catch (error) {
      throw new Error(`Failed to create wallet: ${error.message}`);
    }
  }

  /**
   * Khôi phục ví từ private key
   */
  async restoreWalletFromPrivateKey(privateKey: string): Promise<WalletInfo> {
    try {
      const wallet = new ethers.Wallet(privateKey);
      
      return {
        address: wallet.address,
        privateKey: wallet.privateKey,
        publicKey: wallet.signingKey.publicKey
      };
    } catch (error) {
      throw new Error(`Failed to restore wallet: ${error.message}`);
    }
  }

  /**
   * Khôi phục ví từ mnemonic
   */
  async restoreWalletFromMnemonic(mnemonic: string): Promise<WalletInfo> {
    try {
      const wallet = ethers.Wallet.fromPhrase(mnemonic);
      
      return {
        address: wallet.address,
        privateKey: wallet.privateKey,
        publicKey: wallet.signingKey.publicKey,
        mnemonic: wallet.mnemonic?.phrase
      };
    } catch (error) {
      throw new Error(`Failed to restore wallet from mnemonic: ${error.message}`);
    }
  }

  /**
   * Lấy balance của ví
   */
  async getBalance(address: string): Promise<string> {
    try {
      const provider = new ethers.JsonRpcProvider('https://evm-rpc-testnet.sei-apis.com');
      const balance = await provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      throw new Error(`Failed to get balance: ${error.message}`);
    }
  }

  /**
   * Ký giao dịch
   */
  async signTransaction(privateKey: string, transaction: any): Promise<string> {
    try {
      const wallet = new ethers.Wallet(privateKey);
      const provider = new ethers.JsonRpcProvider('https://evm-rpc-testnet.sei-apis.com');
      const walletWithProvider = wallet.connect(provider);
      
      const signedTx = await walletWithProvider.signTransaction(transaction);
      return signedTx;
    } catch (error) {
      throw new Error(`Failed to sign transaction: ${error.message}`);
    }
  }

  /**
   * Gửi giao dịch đã ký
   */
  async sendSignedTransaction(signedTx: string): Promise<string> {
    try {
      const provider = new ethers.JsonRpcProvider('https://evm-rpc-testnet.sei-apis.com');
      const txResponse = await provider.broadcastTransaction(signedTx);
      return txResponse.hash;
    } catch (error) {
      throw new Error(`Failed to send transaction: ${error.message}`);
    }
  }

  /**
   * Gửi SEI từ một ví đến ví khác
   */
  async sendSei(fromPrivateKey: string, toAddress: string, amount: string): Promise<string> {
    try {
      const wallet = new ethers.Wallet(fromPrivateKey);
      const provider = new ethers.JsonRpcProvider('https://evm-rpc-testnet.sei-apis.com');
      const walletWithProvider = wallet.connect(provider);

      const tx = {
        to: toAddress,
        value: ethers.parseEther(amount),
        gasLimit: 21000,
        gasPrice: await provider.getFeeData().then(fee => fee.gasPrice)
      };

      const txResponse = await walletWithProvider.sendTransaction(tx);
      await txResponse.wait();
      
      return txResponse.hash;
    } catch (error) {
      throw new Error(`Failed to send SEI: ${error.message}`);
    }
  }

  /**
   * Mã hóa private key để lưu trữ an toàn
   */
  encryptPrivateKey(privateKey: string, password: string): string {
    try {
      // Sử dụng encryption key từ config
      const encryptionKey = this.configService.get<string>('WALLET_ENCRYPTION_KEY') || 'default-key';
      
      // Đơn giản hóa cho demo - trong production nên dùng stronger encryption
      const encrypted = Buffer.from(privateKey + '|' + encryptionKey).toString('base64');
      return encrypted;
    } catch (error) {
      throw new Error(`Failed to encrypt private key: ${error.message}`);
    }
  }

  /**
   * Giải mã private key
   */
  decryptPrivateKey(encryptedPrivateKey: string, password: string): string {
    try {
      const encryptionKey = this.configService.get<string>('WALLET_ENCRYPTION_KEY') || 'default-key';
      
      const decrypted = Buffer.from(encryptedPrivateKey, 'base64').toString();
      const [privateKey, key] = decrypted.split('|');
      
      if (key !== encryptionKey) {
        throw new Error('Invalid encryption key');
      }
      
      return privateKey;
    } catch (error) {
      throw new Error(`Failed to decrypt private key: ${error.message}`);
    }
  }

  /**
   * Chuyển đổi public key sang địa chỉ Sei bech32 (optional)
   */
  private convertToSeiAddress(publicKey: string): string {
    try {
      // Remove 0x prefix if present
      const pubKeyBytes = Buffer.from(publicKey.replace('0x', ''), 'hex');
      
      // Hash the public key
      const hash = sha256(pubKeyBytes);
      
      // Take first 20 bytes
      const address = hash.slice(0, 20);
      
      // Convert to bech32 with 'sei' prefix
      return bech32.encode('sei', bech32.toWords(address));
    } catch (error) {
      console.error('Failed to convert to Sei address:', error);
      return '';
    }
  }

  /**
   * Lấy thông tin network
   */
  getNetworkInfo() {
    return {
      chainId: this.chainId,
      currency: this.currency,
      rpcUrl: this.seiRpcUrl,
      explorerUrl: 'https://sei-evm-testnet.block-explorer.com',
      networkName: 'Sei Testnet'
    };
  }
}
