import { Chat } from 'src/chat/chat.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => Chat, (chat) => chat.id)
  chatId: number;

  @Column({
    type: 'nvarchar',
    length: 2000,
  })
  text: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column()
  author: number;
}
