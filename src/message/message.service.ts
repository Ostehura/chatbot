import { Injectable } from '@nestjs/common';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async createMessage(
    text: string,
    chatId: number,
    userId: number,
  ): Promise<Message | undefined> {
    const message = this.messageRepository.create({
      text: text,
      chatId: chatId,
      author: userId,
    });
    return await this.messageRepository.save(message);
  }
}
