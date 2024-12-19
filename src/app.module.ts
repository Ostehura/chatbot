import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import AppDataSource from './data-source';

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
