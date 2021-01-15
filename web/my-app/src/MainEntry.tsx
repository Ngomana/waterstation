import React from "react";
import { useSelector } from "react-redux";
import MapView from "./components/mapView";
import LoginScreen from "./screens/login";
import { iUserState } from "./types/user";

const MainAppEntry = () => {
  const users = useSelector((state: iUserState) => state.user.email);

  return <div>{users.length !== 0 ? <LoginScreen /> : <MapView />}</div>;
};

export default MainAppEntry;
