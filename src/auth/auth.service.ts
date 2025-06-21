import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.userService.createUser(username, hashedPassword);
  }
  async changePassword(
    username: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.validateUser(username, oldPassword);
    if (user == null) {
      return false;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userService.modifyPassword(username, hashedPassword);
    return true;
  }

  async deleteUser(id: number, password: string) {
    let user = await this.userService.findById(id);
    user = await this.validateUser(user.username, password);
    if (user == null) return false;
    return await this.userService.deleteUser(user.id);
  }
}
