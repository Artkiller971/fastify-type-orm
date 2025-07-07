import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne, JoinColumn, ManyToMany, JoinTable} from "typeorm";
import { IsNotEmpty, MinLength } from "class-validator";
import { User } from "./User";
import { Status } from "./Status";
import { Label } from "./Label";

@Entity({
  name: 'tasks'
})
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @MinLength(1, { message: 'Minimal length is $constraint1'})
  name: string

  @Column({ nullable: true })
  description: string

  @ManyToOne(() => Status, (status) => status.tasks)
  @IsNotEmpty({ message: 'Must be selected!'})
  @JoinColumn({name: "status_id"})
  status: Status

  @ManyToOne(() => User, (user) => user.createdTasks)
  @JoinColumn({name: "creator_id"})
  creator: User
 
  @ManyToOne(() => User, (user) => user.assignedTasks, { nullable: true })
  @JoinColumn({name: "executor_id"})
  executor: User

  @ManyToMany(() => Label, (label) => label.tasks, {
    cascade: ['remove', 'update'],
  })
  @JoinTable({
    name: 'tasks_labels',
  })
  labels: Label[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}