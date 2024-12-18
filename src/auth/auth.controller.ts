import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Render,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('register')
  @Render('register')
  registerPage() {
    return { title: 'Register' };
  }

  @Get('login')
  @Render('login')
  loginPage() {
    return { title: 'Log In' };
  }

  @Post('register')
  async register(
    @Body()
    body: {
      username: string;
      password: string;
      confirmPassword: string;
    },
    @Res() res,
  ) {
    if (body.confirmPassword !== body.password) {
      res.status(HttpStatus.UNAUTHORIZED);
      return res.render('register', {
        title: 'Log in',
        error: 'Invalid Credentials',
      });
    }
    await this.authService.register(body.username, body.password);
    return res.redirect('/auth/login');
  }

  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Res() res,
  ) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    if (!user) {
      res.status(HttpStatus.UNAUTHORIZED);
      return res.render('login', {
        title: 'Log in',
        error: 'Invalid Credentials',
      });
    }
    const token = await this.authService.login(body);
    res.cookie('jwt', token.access_token, { httpOnly: true });
    return res.redirect('/');
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
