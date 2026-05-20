import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme.js";
import { CssVarsProvider } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import {store} from "./redux/store";
import { Provider } from 'react-redux'
// import { ThemeProvider } from "@mui/material";
import { ConfirmProvider } from "material-ui-confirm";
createRoot(document.getElementById("root")).render(
  <>
    <Provider store={store}>

    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <ConfirmProvider>
      <App />
      </ConfirmProvider>
    </CssVarsProvider>
     <ToastContainer />  
    </Provider>
  </>
);
