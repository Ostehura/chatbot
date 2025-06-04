import { Injectable } from '@nestjs/common';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MistralService } from 'src/mistral/mistral.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly mistralService: MistralService,
  ) {}

  async createMessage(
    text: string,
    chatId: number,
    userId: number,
  ): Promise<Message | undefined> {
    let message = this.messageRepository.create({
      text: text,
      chatId: chatId,
      author: userId,
    });
    message = await this.messageRepository.save(message);

    const messages = await this.messageRepository.find({
      where: { chatId: chatId },
      order: { id: 'ASC' },
      select: {
        text: true,
        author: true,
      },
    });
    const botResponse = await this.mistralService.getResponse(messages);
    const response = this.messageRepository.create({
      text: botResponse,
      chatId: chatId,
      author: 0,
    });
    await this.messageRepository.save(response);
    return message;
  }

  async addMessageWithOutAiRequest(
    fileContent: string,
    chatId: number,
    userId: number,
  ) {
    const message = this.messageRepository.create({
      text: fileContent,
      chatId: chatId,
      author: userId,
    });
    await this.messageRepository.save(message);
  }
}
