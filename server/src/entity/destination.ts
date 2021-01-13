import { getModelForClass, prop as Property } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Destination {
  @Field()
  @Property({ required: true })
  longitude: string;

  @Field()
  @Property({ required: true })
  latitude: string;
}

export const DestinationModal = getModelForClass(Destination);
