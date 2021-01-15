import { combineReducers, configureStore } from "@reduxjs/toolkit";
import stationSlice from "./stations";
import thunk from "redux-thunk";
import userSlice from "./user";

const reducer = combineReducers({
  stations: stationSlice.reducer,
  user: userSlice.reducer,
});

const store = configureStore({
  reducer,
  middleware: [thunk],
});

export default store;
