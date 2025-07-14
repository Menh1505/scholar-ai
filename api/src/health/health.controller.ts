import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Controller('health')
export class HealthController {
    constructor(private readonly databaseService: DatabaseService) { }

    @Get('database')
    async checkDatabase() {
        return await this.databaseService.healthCheck();
    }

    @Get()
    async checkHealth() {
        const dbHealth = await this.databaseService.healthCheck();
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            database: dbHealth,
        };
    }
}
