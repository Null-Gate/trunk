import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const theme = createTheme({
  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "64em",
    lg: "74em",
    xl: "90em",
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={new QueryClient()}>
      <MantineProvider theme={theme}>
        <ToastContainer />
        <App />
      </MantineProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
