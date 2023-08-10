import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import WebFont from "webfontloader";
import * as serviceWorker from "./serviceWorker";
import { UserProvider } from "./context/UserContext";
import Layout from "./Components/Layout";

const activeLabelStyles = {
  transform: "scale(0.85) translateY(-24px)",
};

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontFamily: "'Inter', sans-serif",
        fontWeight: 400,
        lineHeight: 1.3,
        color: "#222",
        backgroundColor: "purple.100",
        overflowX: "hidden",
      },
    },
  },
  components: {
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label": {
              ...activeLabelStyles,
            },
            "textarea:not(:placeholder-shown) + label, .chakra-select__wrapper + label": {
              ...activeLabelStyles,
            },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: "absolute",
              backgroundColor: "white",
              pointerEvents: "none",
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: "left top",
              color: "purple.400",
            },
          },
        },
      },
    },
  },
});
const container = document.getElementById("root");

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <UserProvider>
        <Router>
          <Layout>
            <App />
          </Layout>
        </Router>
      </UserProvider>
    </ChakraProvider>
  </React.StrictMode>
);

WebFont.load({
  google: {
    families: ["Inter:ital,wght@0,400;0,600;0,900;1,400;1,300"],
  },
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
