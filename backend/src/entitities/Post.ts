//import { Entity, PrimaryKey, Column } from "@mikro-orm/core";

import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity()
export class Post extends BaseEntity{
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