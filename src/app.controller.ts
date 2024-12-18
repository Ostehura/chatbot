import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getHello(): string {
    return this.appService.getHello();
  }
  @Post()
  @UseGuards(JwtAuthGuard)
  getHello1(): string {
    return this.appService.getHello();
  }
}
