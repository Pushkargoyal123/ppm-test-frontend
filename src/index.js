import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./App.css";
import { createStore } from "redux"
import { Provider } from 'react-redux';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import RootReducer from "./service/RootReducer";

var store= createStore(RootReducer);

ReactDOM.render(
   <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorkerRegistration.register();
