import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne} from "typeorm";
import { MinLength } from "class-validator";
import { Exclude } from "class-transformer";
import { Users } from "./User";
import { Statuses } from "./Status";

@Entity()
export class Tasks extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column()
  @MinLength(1, { message: 'Minimal length is $constraint1'})
  name: string;

  @Column({ nullable: true })
  description: string

  @ManyToOne(() => Statuses, (status) => status.tasks)
  status: Statuses

  @ManyToOne(() => Users, (user) => user.createdTasks)
  creator: Users

  @ManyToOne(() => Users, (user) => user.assignedTasks, { nullable: true })
  executor: Users | null

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}