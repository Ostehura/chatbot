import { Controller, Render, Request, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  @Get('')
  @Render('user')
  async changePassword(@Request() req) {
    return { title: 'Settings', user: req.user, error: '' };
  }
}
