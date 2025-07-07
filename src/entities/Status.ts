import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToMany} from "typeorm";
import { MinLength } from "class-validator";
import { Exclude } from "class-transformer";
import { Task } from "./Task";

@Entity({
  name: 'statuses'
})
export class Status extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column()
  @MinLength(1,{ message: 'Minimal length is $constraint1'})
  name: string;

  @OneToMany(() => Task, (task) => task.status)
  tasks: Task[]


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}