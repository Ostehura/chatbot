import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}
  async getUserChats(userId: number): Promise<Chat[]> {
    return await this.chatRepository.find({
      where: { userId: userId },
      relations: { messages: true },
    });
  }
  async getChat(id: number): Promise<Chat | undefined> {
    return await this.chatRepository.findOne({
      where: { id: id },
      relations: { messages: true },
    });
  }
  async createChat(id: number): Promise<Chat | undefined> {
    const chat = this.chatRepository.create({ userId: id, title: 'New chat' });
    return await this.chatRepository.save(chat);
  }
}
