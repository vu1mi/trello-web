import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme.js";
import { CssVarsProvider } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import {store} from "./redux/store";
import { Provider } from 'react-redux'
import { ConfirmProvider } from "material-ui-confirm";
// cau hinh route cho app
import { BrowserRouter } from "react-router-dom";
import { persistStore } from "redux-persist";
import {PersistGate} from 'redux-persist/integration/react'

// inject redux store vao authorizeAxios de su dung trong interceptor
import {injectStore} from '~/utils/authorizeAxios';

injectStore(store);

const persistor = persistStore(store);

createRoot(document.getElementById("root")).render(
  <>
      <BrowserRouter basename="/">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <CssVarsProvider theme={theme}>
              <CssBaseline />
              <ConfirmProvider>
                <ToastContainer/>
                <App />
              </ConfirmProvider>
            </CssVarsProvider>
          </PersistGate>
        </Provider>
    </BrowserRouter>
  </>
);
