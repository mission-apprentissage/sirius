import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { UserProvider } from "./context/UserContext";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

startReactDsfr({ defaultColorScheme: "light", Link });

const queryClient = new QueryClient();

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
        backgroundColor: "brand.blue.100",
        overflowX: "hidden",
      },
      strong: {
        fontWeight: "semibold",
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
  colors: {
    brand: {
      red: {
        500: "#F95C5E",
      },
      pink: {
        900: "#A94645",
        400: "#FCBFB7",
        50: "#FEF4F3",
      },
      blue: {
        700: "#000091",
        500: "#6A6AF4",
        400: "#CACAFB",
        300: "#E3E3FD",
        100: "#F5F5FE",
      },
      black: {
        500: "#161616",
      },
      gray: {
        700: "#2D3748",
      },
    },
    progressBar: {
      700: "#000091",
      500: "#4747B0",
    },
  },
});
const container = document.getElementById("root");

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <UserProvider>
          <Router>
            <App />
          </Router>
        </UserProvider>
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
