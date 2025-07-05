import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne, JoinColumn} from "typeorm";
import { IsNotEmpty, MinLength } from "class-validator";
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
  @IsNotEmpty({ message: 'Must be selected!'})
  @JoinColumn({name: "status_id"})
  status: Statuses

  @ManyToOne(() => Users, (user) => user.createdTasks)
  @JoinColumn({name: "creator_id"})
  creator: Users

  @ManyToOne(() => Users, (user) => user.assignedTasks, { nullable: true })
  @JoinColumn({name: "executor_id"})
  executor: Users

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


}