import { getModelForClass, prop as Property } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Destination {
  @Field()
  @Property({ required: true })
  longitude: number;

  @Field()
  @Property({ required: true })
  latitude: number;
}

export const DestinationModal = getModelForClass(Destination);
