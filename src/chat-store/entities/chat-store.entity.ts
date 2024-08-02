import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class ChatStore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  threadId: string;

  @Column()
  from: string;

  @Column()
  content: string;

  @Column()
  time: string;

  @ManyToOne(() => ConversationChat, conversation => conversation.topic)
  conversation: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity()
export class ConversationChat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  topic: string;

  @Column()
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;
}