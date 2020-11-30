import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
// @ts-ignore
import { io } from "socket.io-client/dist/socket.io.js"

const socket = io.connect("http://tic-tac-server-node.herokuapp.com/", {
    withCredentials: false
  });

ReactDOM.render(
  <React.StrictMode>
    <App socket={socket} />
  </React.StrictMode>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
