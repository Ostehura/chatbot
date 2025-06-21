import {
  Controller,
  Post,
  UseGuards,
  Request,
  Response,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MessageService } from './message.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as pdf from 'pdf-parse';

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
    if (!body.text || body.text.trim() === '') {
      return res.status(400).send('Message cannot be empty');
    }
    await this.messageService.createMessage(
      body.text,
      body.chatId,
      req.user.userId,
    );
    return res.redirect(`/chat/${body.chatId}`);
  }

  @UseGuards(JwtAuthGuard)
  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Request() req,
    @Response() res,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'pdf' })],
      }),
    )
    file: Express.Multer.File,
    @Body() body: { chatId: number },
  ) {
    console.log({
      body,
    });
    const content = file.buffer;
    const text = (await pdf(content)).text;
    await this.messageService.addMessageWithOutAiRequest(
      'User has send you a file and would like you to answear further quetions based on it content. Long messages can be sent in seperate message one by one.',
      body.chatId,
      -1,
    );
    for (let i = 0; i < text.length; i += 2000) {
      await this.messageService.addMessageWithOutAiRequest(
        text.slice(i, i + 2000),
        body.chatId,
        req.user.userId,
      );
      // console.log(text.slice(i, i + 2000));
    }
    return res.redirect(`/chat/${body.chatId}`);
  }
}
