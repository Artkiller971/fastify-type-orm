import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToMany} from "typeorm";
import { MinLength } from "class-validator";
import { Exclude } from "class-transformer";
import { Tasks } from "./Task";

@Entity()
export class Statuses extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column()
  @MinLength(1,{ message: 'Minimal length is $constraint1'})
  name: string;

  @OneToMany(() => Tasks, (task) => task.status)
  tasks: Tasks[]


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}