import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Render,
  Response,
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
    @Response() res,
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
    @Response() res,
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
    const token = await this.authService.login(user);
    res.cookie('jwt', token.access_token, { httpOnly: true });
    return res.redirect('/');
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('changePassword')
  async changePassword(
    @Response() res,
    @Body()
    body: {
      username: string;
      oldPassword: string;
      newPassword: string;
    },
    @Request() req,
  ) {
    if (
      await this.authService.changePassword(
        body.username,
        body.oldPassword,
        body.newPassword,
      )
    ) {
      res.redirect('/');
    } else {
      res.redirect('/user', HttpStatus.BAD_REQUEST, {
        title: 'Change password',
        user: req.user,
        error: true,
      });
    }
  }
  @Post('delete')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Request() req, @Body() body: { password: string }) {
    this.authService.deleteUser(req.user.userId, body.password);
  }

  @Get('delete')
  async handleDeletedUser(@Response() res) {
    return res.redirect('/auth/login');
  }
}
