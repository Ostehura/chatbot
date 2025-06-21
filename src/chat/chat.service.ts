import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/message/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}
  async getUserChats(userId: number): Promise<Chat[]> {
    const chat = await this.chatRepository.find({
      where: { userId: userId },
      relations: { messages: true },
    });
    chat.map((chat) => {
      chat.messages.sort((lhs, rhs) => rhs.id - lhs.id);
    });

    return chat;
  }
  async getChat(id: number): Promise<Chat | undefined> {
    const chat = await this.chatRepository.findOne({
      where: { id: id },
      relations: { messages: true },
    });
    chat.messages.sort(
      (lhs, rhs) =>
        new Date(lhs.createdAt).getTime() - new Date(rhs.createdAt).getTime(),
    );
    const preprocessedMessages: Message[] = [];
    for (let i = 0; i < chat.messages.length; i++) {
      if (preprocessedMessages.length == 0) {
        preprocessedMessages.push(chat.messages[i]);
      } else {
        const lastMessage =
          preprocessedMessages[preprocessedMessages.length - 1];
        const next = chat.messages[i];
        if (
          lastMessage.author == next.author &&
          new Date(next.createdAt).getTime() -
            new Date(lastMessage.createdAt).getTime() <=
            1000
        ) {
          preprocessedMessages[preprocessedMessages.length - 1].text +=
            next.text;
          preprocessedMessages[preprocessedMessages.length - 1].createdAt =
            next.createdAt;
        } else {
          preprocessedMessages.push(next);
        }
      }
    }
    chat.messages = preprocessedMessages;
    return chat;
  }
  async createChat(id: number): Promise<Chat | undefined> {
    const chat = this.chatRepository.create({ userId: id, title: 'New chat' });
    return await this.chatRepository.save(chat);
  }

  async deleteChat(userId: number, chatId: number): Promise<boolean> {
    const chat = await this.getChat(chatId);
    if (chat.userId != userId) {
      return false;
    }
    const result = await this.chatRepository.delete({ id: chatId });
    return result.affected !== 0;
  }
}
