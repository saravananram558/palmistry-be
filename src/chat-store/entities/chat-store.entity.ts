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

  @ManyToOne(() => Conversation, conversation => conversation.messages)
  conversation: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  topic: string;

  @Column()
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ChatStore, chatStore => chatStore.conversation)
  messages: ChatStore[];
}