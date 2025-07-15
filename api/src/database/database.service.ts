import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Connection, connect } from 'mongoose';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private static instance: DatabaseService;
  private connection: Connection;
  private readonly connectionString: string;
  private readonly logger = new Logger(DatabaseService.name);

  constructor() {
    this.connectionString =
      process.env.MONGO_URI ||
      'mongodb://root:m1505@127.0.0.1:27017/scholar?authSource=admin';
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect(): Promise<void> {
    try {
      if (!this.connection) {
        const mongoose = await connect(this.connectionString, {
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          bufferCommands: false,
        });
        this.connection = mongoose.connection;
        this.logger.log('✅ MongoDB connected successfully');

        // Event listeners
        this.connection.on('connected', () => {
          this.logger.log('MongoDB connected');
        });

        this.connection.on('error', (err) => {
          this.logger.error('MongoDB connection error:', err);
        });

        this.connection.on('disconnected', () => {
          this.logger.log('MongoDB disconnected');
        });
      }
    } catch (error) {
      this.logger.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  private async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      this.logger.log('🔌 MongoDB disconnected');
    }
  }

  getConnection(): Connection {
    if (!this.connection) {
      throw new Error('Database connection not established');
    }
    return this.connection;
  }

  isConnected(): boolean {
    return this.connection?.readyState === 1;
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return {
      status: this.isConnected() ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }
}
