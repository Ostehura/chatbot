import { User } from 'src/user/user.entity';
import { Message } from 'src/message/message.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => User, (user) => user.id)
  userId: number;

  @Column({ nullable: true })
  title: string;

  @OneToMany(() => Message, (message) => message.chatId)
  messages: Message[];
}
