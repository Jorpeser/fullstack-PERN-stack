//import { Entity, PrimaryKey, Column } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, BaseEntity } from "typeorm";

@ObjectType()
@Entity()
export class Thread extends BaseEntity{
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String) 
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column()
  title!: string;

}