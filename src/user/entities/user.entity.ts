import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class UserDetails {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @ManyToOne(() => ZodicSign, ZodicSign => ZodicSign.id)
    zodicSign: number;

    @ManyToOne(() => Gender, Gender => Gender.id)
    gender: number;

    @Column()
    dateOfBirth: string;

    @Column()
    timeOfBirth:string;

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

@Entity()
export class ZodicSign {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    signName: string;
}