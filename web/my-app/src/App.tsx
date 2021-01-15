import React from "react";
import { Provider } from "react-redux";
import "./App.css";

import MainAppEntry from "./MainEntry";
import store from "./redux";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <MainAppEntry />
      </div>
    </Provider>
  );
}

export default App;
