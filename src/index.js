import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
// import "bootstrap/dist/css/bootstrap.css";

import "./css/main.css";
import "./App.css";
import "leaflet/dist/leaflet.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
// import "mapbox-gl/dist/mapbox-gl.css";
import "./index.css";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
