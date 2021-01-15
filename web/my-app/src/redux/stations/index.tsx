import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { iStation, iStationApi } from "../../types/stations";

const initialState: iStation[] = [];

export const api = "http://localhost:8000/graphql";

export const query = `
query {
  getStations {
    stationId
    location{
      longitude
      latitude
    }
    stationType
    capacity
  }
}`;

export const getStations = createAsyncThunk(
  "stations/getStations",
  async (obj, { dispatch, getState }) => {
    const { stations }: any = getState();
    console.log(stations);
    return fetch(api, {
      method: "POST",
      body: JSON.stringify({ query }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      const dataa = res.json();
      dataa.then((resData) => {
        return resData.data.getStations;
      });
    });
  }
);

const stationSlice = createSlice({
  name: "station",

  initialState: initialState,

  reducers: {
    create: {
      reducer: (state, { payload }: PayloadAction<iStation>) => {
        state.push(payload);
      },
      prepare: (station) => ({
        payload: station,
      }),
    },
    edit: (state, { payload }: PayloadAction<iStation>) => {
      /* eslint-disable */
      const findStation = state.find((x) => {
        x.stationId === payload.stationId;
      });

      if (findStation) {
        findStation.capacity === payload.capacity;
        findStation.location.latitude === payload.location.latitude;
        findStation.location.longitude === payload.location.longitude;
        findStation.stationType === payload.stationType;
      }
    },
    remove: (state, { payload }) => {
      const findStation = state.findIndex(
        (station) => station.stationId === payload.stationId
      );

      if (findStation !== 1) {
        state.splice(findStation, 1);
      }
    },
  },

  // extraReducers: {
  //   [getStations.fulfilled.toString()]: (state, { payload }: any) => {
  //     state.push(payload);
  //   },
  // },
});

export const {
  create: addStationAction,
  edit: editStationAction,
  remove: deleteStationAction,
} = stationSlice.actions;

export default stationSlice;
