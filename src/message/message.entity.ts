import { Chat } from 'src/chat/chat.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => Chat, (chat) => chat.id)
  chatId: number;

  @Column()
  text: string;

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column()
  author: number;
}
