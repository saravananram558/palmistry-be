// src/chatStore/chat.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class ChatStore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  from: string;

  @Column()
  content: string;

  @CreateDateColumn()
  time: Date;
}
