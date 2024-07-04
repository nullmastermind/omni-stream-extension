import React from "react";
import ReactDOM from "react-dom/client";
import { Popup } from "./Popup";
import "./index.css";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";

const theme = createTheme({
  /** Put your mantine theme override here */
});

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme={"dark"}>
      <Popup />
    </MantineProvider>
  </React.StrictMode>,
);
