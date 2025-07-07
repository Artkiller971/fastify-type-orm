import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToMany} from "typeorm";
import { MinLength } from "class-validator";
import { Exclude } from "class-transformer";
import { Task } from "./Task";

@Entity({
  name: 'labels'
})
export class Label extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Exclude({
    toPlainOnly: true,
  })
  id: number

  @Column()
  @MinLength(1, { message: 'Minimal length is $constraint1'})
  name: string

  @ManyToMany(() => Task, (task) => task.labels)
  tasks: Task[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}