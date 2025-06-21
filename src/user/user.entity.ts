import { Chat } from 'src/chat/chat.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Chat, (chat) => chat.userId, { cascade: ['remove'] })
  chats: Chat[];
}
