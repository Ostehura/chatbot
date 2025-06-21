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
import * as MarkdownIt from 'markdown-it';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @Render('chats')
  @UseGuards(JwtAuthGuard)
  @Get()
  async chatsPage(@Request() req) {
    const chats = (await this.chatService.getUserChats(req.user.userId)).map(
      (chat) => ({
        id: chat.id,
        firstMessage:
          chat.messages.length == 0
            ? 'Write to start chat'
            : chat.messages[0].text.length > 100
              ? chat.messages[0].text.slice(0, 97) + '...'
              : chat.messages[0].text,
        title: chat.title,
        userId: chat.userId,
      }),
    );

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
    const md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
    });
    const messages = chat.messages
      .filter((value) => value.author >= 0)
      .map((value) => {
        return {
          id: value.id,
          createdAt: value.createdAt,
          chatId: value.chatId,
          author: value.author == 0 ? 'AI' : 'You',
          text: value.text
            .replace(/\r\n/g, '\n')
            .replace(/^```(?:\w*)\n/, '')
            .replace(/\n```$/, '')
            .split('\n')
            .map((str) => md.render(str.replace('\n', '')))
            .join(''),
        };
      });

    const renderedChat = {
      id: chat.id,
      title: chat.title,
      chat: chat.userId,
      messages: messages,
    };

    return {
      title: `Chat ${chat.title}`,
      chat: renderedChat,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('new')
  async createChat(@Request() req, @Response() res) {
    const chat = await this.chatService.createChat(req.user.userId);
    return res.redirect(`/chat/${chat.id}`);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/delete')
  async deleteChat(@Param('id') id: number, @Request() req, @Response() res) {
    await this.chatService.deleteChat(req.user.userId, id);
    return res.redirect('/chat');
  }
}
