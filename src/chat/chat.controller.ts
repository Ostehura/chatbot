import {
  Controller,
  Get,
  UseGuards,
  Request,
  Render,
  Response,
  Post,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @Render('chats')
  @UseGuards(JwtAuthGuard)
  @Get()
  async chatsPage(@Request() req) {
    const chats = await this.chatService.getUserChats(req.user.userId);
    return {
      title: 'Chat List',
      chats,
    };
  }

  @Render('chat')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async chatPage(@Param('id') id: number, @Request() req) {
    const chat = await this.chatService.getChat(id);
    if (req.user.userId != chat.userId) {
      throw new UnauthorizedException('Have no access to chat');
    }
    return {
      title: `Chat ${chat.title}`,
      chat,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('new')
  async createChat(@Request() req, @Response() res) {
    const chat = await this.chatService.createChat(req.user.userId);
    return res.redirect(`/chat/${chat.id}`);
  }
}
