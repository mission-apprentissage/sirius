import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Link } from "react-router-dom";

import App from "./App";
import { UserProvider } from "./context/UserContext";
import * as serviceWorker from "./serviceWorker";

Sentry.init({
  dsn: "https://f97984280f4e4a4e8075e8b353b9234a@sentry.incubateur.net/153",
  enabled: process.env.REACT_APP_SIRIUS_ENV !== "dev",
  tracePropagationTargets: [/^https:\/\/[^/]*\.inserjeunes\.beta\.gouv\.fr/],
  integrations: [new BrowserTracing()],
  tracesSampleRate: process.env.REACT_APP_SIRIUS_ENV === "production" ? 0.3 : 1.0,
  environment: process.env.REACT_APP_SIRIUS_ENV,
});

const QUERY_CLIENT_RETRY_DELAY = 3000;
const QUERY_CLIENT_RETRY_ATTEMPTS = 1;

startReactDsfr({ defaultColorScheme: "light", Link: Link as any });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 4 * (60 * 1000),
      retry: QUERY_CLIENT_RETRY_ATTEMPTS, // retry failing requests just once, see https://react-query.tanstack.com/guides/query-retries
      retryDelay: QUERY_CLIENT_RETRY_DELAY, // retry failing requests after 3 seconds
      refetchOnWindowFocus: false, // see https://react-query.tanstack.com/guides/important-defaults
      refetchOnReconnect: false,
    },
  },
});

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

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <UserProvider>
          <Router>
            <App />
          </Router>
        </UserProvider>
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
