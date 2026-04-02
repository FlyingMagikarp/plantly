import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpeciesModule } from './species/species.module';
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [
      SpeciesModule,
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '1234',
        database: 'plantly',
        autoLoadEntities: true,
        synchronize: false,
        migrations: [__dirname+'/db/migration/**/*{.js,.ts}'],
        migrationsRun: false,
        migrationsTableName: 'migrations',
        migrationsTransactionMode: 'all',
      }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
