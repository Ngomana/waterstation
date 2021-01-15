import {
  GoogleMap,
  Marker,
  useLoadScript,
  InfoWindow,
} from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { iStation, iStationArray } from "../../types/stations";
import {
  addStationAction,
  api,
  getStations,
  query,
} from "../../redux/stations";

const MapView = ({ children }: any) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [statioId, setStationId] = useState(0);
  const [latitude, setLatitude] = useState(0);

  const [longitude, setLongitude] = useState(0);
  const [capacity, setCapacity] = useState(0);
  const [stationType, setStationType] = useState("");

  //adding stations marker
  const [addStation, setAddStation] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_API_KEY!,
    libraries: ["places"],
  });
  const locations = useSelector((state: iStationArray) => state.stations);

  const dispatch = useDispatch();

  const createStation = () => {
    const newStationId = "";
    const query = `
    mutation {
      createStation(
        stationId: ${newStationId}
        capacity: ${capacity}
        stationType: "${stationType}"
        latitude: ${latitude}
        longitude: ${longitude}
      ) {
        stationId
        location {
          longitude
          latitude
        }
        capacity
        stationType
      }
    }
    `;

    try {
      fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify({ query }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        console.log(res);
      });

      dispatch(
        addStationAction({
          stationId: parseFloat(newStationId),
          location: {
            latitude: latitude,
            longitude: longitude,
          },
          stationType: stationType,
          capacity: capacity,
        })
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const updateStation = () => {};

  const deleteStation = () => {};

  const onChangeLatitude = (e: any) => {
    const value = parseFloat(e.target.value);
    setLatitude(value);
  };
  const onChangeLongitude = (e: any) => {
    const value = parseFloat(e.target.value);
    setLongitude(value);
  };
  const onChangeCapacity = (e: any) => {
    const value = parseFloat(e.target.value);
    setCapacity(value);
  };
  const onChangeStationType = (e: any) => {
    const value = e.target.value;

    setStationType(value);
  };
  // const onChange = (e) => {
  //   const value = e.target.value;
  //   set
  // }

  useEffect(() => {
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify({ query }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      const dataa = res.json();
      dataa.then((x) => {
        const test = x.data.getStations;

        for (var data of test) {
          dispatch(
            addStationAction({
              stationId: parseFloat(data.stationId),
              location: {
                latitude: parseFloat(data.location.latitude),
                longitude: parseFloat(data.location.longitude),
              },
              stationType: data.stationType,
              capacity: parseFloat(data.capacity),
            })
          );

          console.log(data);
          console.log(locations);
        }
      });
    });
  }, []);

  if (loadError) return <h2>Error loading maps</h2>;

  if (!isLoaded) return <h2>Loading Maps</h2>;

  interface iStationType {
    id: number;
    stationType: string;
  }
  const stationTypeData: iStationType[] = [
    {
      id: 1,
      stationType: "Community Pump",
    },

    { id: 2, stationType: "Pumping Station" },
    {
      id: 3,
      stationType: "Dam",
    },
    { id: 4, stationType: "Well" },
  ];

  return (
    <div>
      <h1>Click On Map To Add new Water Station</h1>
      <h3>or</h3>
      <h1>Search To Add new Water Station</h1>
      <GoogleMap
        mapContainerStyle={{ width: "100vw", height: "100vh" }}
        zoom={8}
        center={{
          //don't forget to set defualt location
          //default location will be "Sierra Leone"
          lat: 8.460555,
          lng: -11.779889,
        }}
        onClick={(e) => {
          setAddStation(true);
          setShowEdit(false);
          setShowInfo(false);

          setLatitude(0);
          setLongitude(0);
          setCapacity(0);

          setLatitude(e.latLng.lat());
          setLongitude(e.latLng.lng());
        }}
      >
        {addStation ? (
          <div>
            <InfoWindow
              position={{
                lat: latitude,
                lng: longitude,
              }}
              onCloseClick={() => {
                setAddStation(false);
                setShowEdit(false);
                setShowInfo(false);

                setLatitude(0);
                setLongitude(0);
                setCapacity(0);
              }}
            >
              <div>
                <select
                  onChange={(e) => {
                    console.log(e.target.value);
                  }}
                >
                  <option value="">Select Station Type</option>
                  {stationTypeData.map((x) => {
                    return (
                      <option key={x.id.toString()} value={x.stationType}>
                        {x.stationType}
                      </option>
                    );
                  })}
                </select>
                <input type="input" placeholder="Station Capacity" />

                <div>
                  <button>Add</button>
                </div>
              </div>
            </InfoWindow>
            <Marker
              position={{
                lat: latitude,
                lng: longitude,
              }}
            />
          </div>
        ) : (
          <div>
            {locations.map((location: iStation) => (
              <Marker
                key={location.stationId}
                position={{
                  lat: location.location.latitude,
                  lng: location.location.longitude,
                }}
                icon={{
                  url: require("../../assets/marker.png"),
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(15, 15),
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
                onClick={() => {
                  setShowInfo(true);
                  setStationId(location.stationId);
                  setLatitude(location.location.latitude);
                  setLongitude(location.location.longitude);
                  setCapacity(location.capacity);
                  setStationType(location.stationType);
                }}
              />
            ))}

            {showInfo ? (
              <InfoWindow
                position={{
                  lat: latitude,
                  lng: longitude,
                }}
                onCloseClick={() => {
                  setShowInfo(false);
                  setShowEdit(false);
                  setStationId(0);
                  setLatitude(0);
                  setLongitude(0);
                  setCapacity(0);
                  setStationType("");
                }}
              >
                <div>
                  {showEdit ? (
                    <div>
                      <select
                        onChange={(e) => {
                          console.log(e.target.value);
                        }}
                      >
                        <option value="">Select Station Type</option>
                        {stationTypeData.map((x) => {
                          return (
                            <option key={x.id.toString()} value={x.stationType}>
                              {x.stationType}
                            </option>
                          );
                        })}
                      </select>
                      <input type="text" placeholder="Station Capacity" />
                      <input type="text" placeholder="Latitude" />
                      <input type="text" placeholder="Longitude" />
                      <button>Save</button>
                      <button>Cancel</button>
                    </div>
                  ) : (
                    <div>
                      <div>
                        <h2>Water Station</h2>
                        <h3>{`Station ID: ${statioId}`}</h3>
                        <p>{`Station Type: ${stationType}`}</p>
                        <p>{`Station Capacity ${capacity}`}</p>
                        <p>{`Latitude: ${latitude}`}</p>
                        <p>{`Longitude ${longitude}`}</p>
                      </div>

                      <div>
                        <button>Delete</button>
                        <button
                          onClick={() => {
                            setShowEdit(true);
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </InfoWindow>
            ) : null}
          </div>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapView;
