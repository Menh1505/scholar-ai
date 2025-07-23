import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get('database')
  checkDatabase() {
    return {
      status: this.connection.readyState === 1 ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  checkHealth() {
    const dbHealth = this.checkDatabase();
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbHealth,
    };
  }
}
