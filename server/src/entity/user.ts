import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  id: ObjectId;

  @Field()
  @Property({ required: true })
  email: string;

  @Property({ required: true })
  password: string;

  @Property({ default: 0 })
  tokenVersion: number;
}

export const UserModel = getModelForClass(User);
