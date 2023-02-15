import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import WebFont from "webfontloader";
import * as serviceWorker from "./serviceWorker";
import * as Hotjar from "./utils/hotjar";
import GlobalStyle from "./common/GlobalStyle";

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <GlobalStyle />
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

WebFont.load({
  google: {
    families: ["Public+Sans:ital,wght@0,400;0,600;0,900;1,400;1,300"],
  },
});

Hotjar.initialize(process.env.REACT_APP_SIRIUS_HOTJAR_ID);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
