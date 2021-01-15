import { Station, StationModal } from "../../entity/station";
import { Resolver, Query, Mutation, Arg } from "type-graphql";

@Resolver()
export class StationResolver {
  /**
   * Query for all stations
   */
  @Query(() => [Station!]!)
  async getStations() {
    try {
      const findStations = StationModal.find(); //note no paramters to be passed for testing purposes only
      return await findStations;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //updating of a water station
  @Mutation(() => Station)
  async updateStation(
    //paramaters
    @Arg("stationId") stationId: number,
    @Arg("longitude") longitude: number,
    @Arg("latitude") latitude: number,
    @Arg("stationType") stationType: string,
    @Arg("capacity") capacity: number
  ) {
    try {
      const updateStation = await StationModal.findOneAndUpdate(
        {
          /**
           * Searching for station ID;
           * if found new changed variables will be entered
           */
          stationId: stationId,
        },

        {
          /**
           * returing a new water station with updated details
           */

          stationId,
          location: {
            longitude: longitude,
            latitude: latitude,
          },
          stationType,
          capacity,
        },
        { new: false }
      );

      return await updateStation;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * Deleteing a station function
   */

  @Mutation(() => Boolean)
  async deleteStation(
    //paramaters
    @Arg("stationId") stationId: number
  ) {
    try {
      const deleteStation = StationModal.findOneAndDelete(
        {
          /**
           * Searching for station ID;
           */
          stationId: stationId,
        },
        // (err: any) => {
        //   if (err) {
        //     return console.log(err);
        //   }
        // },

        console.log(`Station with ID: ${stationId} has been deleted`)
      );
      return (await deleteStation) && true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //creating a new water station
  @Mutation(() => Station)
  async createStation(
    //paramaters

    @Arg("stationId") stationId: number,
    @Arg("longitude") longitude: number,
    @Arg("latitude") latitude: number,
    @Arg("stationType") stationType: string,
    @Arg("capacity") capacity: number
  ): Promise<Station> {
    try {
      const station = await StationModal.create({
        stationId,
        location: {
          longitude: longitude,
          latitude: latitude,
        },
        stationType,
        capacity,
      });

      return await station.save();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
