import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";
import App from "./App";
import WebFont from "webfontloader";
import * as serviceWorker from "./serviceWorker";
import * as Hotjar from "./utils/hotjar";
import GlobalStyle from "./common/GlobalStyle";
import { UserProvider } from "./context/UserContext";
import Layout from "./Components/Layout";

const activeLabelStyles = {
  transform: "scale(0.85) translateY(-24px)",
};

const CustomSteps = {
  ...Steps,
  sizes: {
    ...Steps.sizes,
    sm: {
      ...Steps.sizes.sm,
      label: {
        ...Steps.sizes.sm.label,
        width: "auto",
      },
    },
    md: {
      ...Steps.sizes.md,
      label: {
        ...Steps.sizes.md.label,
        width: "100px",
      },
    },
  },
};

export const theme = extendTheme({
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
    Steps: CustomSteps,
  },
});
const container = document.getElementById("root");

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <GlobalStyle />
      <UserProvider>
        <Layout>
          <App />
        </Layout>
      </UserProvider>
    </ChakraProvider>
  </React.StrictMode>
);

WebFont.load({
  google: {
    families: ["Public+Sans:ital,wght@0,400;0,600;0,900;1,400;1,300"],
  },
});

if (process.env.NODE_ENV !== "development") {
  Hotjar.initialize(process.env.REACT_APP_SIRIUS_HOTJAR_ID);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
