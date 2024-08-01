import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class UserDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  zodiacSign: string;

  @ManyToOne(() => Gender, (gender) => gender.id)
  gender: number;

  @Column({ type: 'date' })
  dateOfBirth: string;

  @Column({ type: 'time' })
  timeOfBirth: string; 
  
  @CreateDateColumn()
  createdAt: Date;
}

@Entity()
export class Gender {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    genderType: string;
}