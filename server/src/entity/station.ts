import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { Destination } from "./destination";

@ObjectType()
export class Station {
  @Field()
  @Property({ required: true })
  stationId: number;

  @Field()
  @Property({ required: true })
  location: Destination;

  @Field()
  @Property({ required: true })
  stationType: string;

  @Field()
  @Property({ required: true })
  capacity: number;
}

export const StationModal = getModelForClass(Station);
