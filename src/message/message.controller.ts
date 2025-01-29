import {
  Controller,
  Post,
  UseGuards,
  Request,
  Response,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('new')
  async newMessage(
    @Request() req,
    @Response() res,
    @Body() body: { text: string; chatId: number },
  ) {
    await this.messageService.createMessage(
      body.text,
      body.chatId,
      req.user.userId,
    );
    return res.redirect(`/chat/${body.chatId}`);
  }
}
