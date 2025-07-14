import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Global()
@Module({
    providers: [
        {
            provide: DatabaseService,
            useFactory: () => DatabaseService.getInstance(),
        },
    ],
    exports: [DatabaseService],
})
export class DatabaseModule { }
