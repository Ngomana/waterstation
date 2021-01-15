export interface iStation {
  stationId: number;
  location: {
    latitude: number;
    longitude: number;
  };
  stationType: string;
  capacity: number;
}

export interface iStationApi {
  stations?: [
    {
      stationId?: number;
      location?: {
        latitude?: number;
        longitude?: number;
      };
      stationType?: string | null;
      capacity?: number;
    }
  ];
  status?: string;
}

export interface iStationArray {
  stations: [
    {
      stationId: number;
      location: {
        latitude: number;
        longitude: number;
      };
      stationType: string;
      capacity: number;
    }
  ];
}
