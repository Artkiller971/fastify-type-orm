import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, BeforeInsert, OneToMany} from "typeorm";
import { MinLength, IsEmail } from "class-validator";
import encrypt from '../helpers/hash';
import { Exclude } from "class-transformer";
import { Task } from "./Task";

@Entity({
  name: 'users'
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column()
  @MinLength(1,{ message: 'Minimal length is $constraint1'})
  firstName: string;

  @Column()
  @MinLength(1, { message: 'Minimal length is $constraint1'})
  lastName: string;

  @Column({ unique: true })
  @IsEmail({}, { message: 'Must be a valid email' })
  email: string;

  @Column()
  @MinLength(3, { message: 'Minimal length is $constraint1'})
  password: string;

  @OneToMany(() => Task, (task) => task.creator)
  createdTasks: Task[]

  @OneToMany(() => Task, (task) => task.executor)
  assignedTasks: Task[]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  hashPassword() {
    this.password = encrypt(this.password);
  }

  public get name() : string {
    return `${this.firstName} ${this.lastName}`;
  }

  verifyPassword(value: string): boolean {
    return encrypt(value) === this.password;
  }
}