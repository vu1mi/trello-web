import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme.js';
import { CssVarsProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { ConfirmProvider } from 'material-ui-confirm';
// cau hinh route cho app
import { BrowserRouter } from 'react-router-dom';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { GlobalStyles } from '@mui/material';
// inject redux store vao authorizeAxios de su dung trong interceptor
import { injectStore } from '~/utils/authorizeAxios';
import { io } from "socket.io-client";
import { API_ROOT } from './utils/constants';

export const socketInstance = io(API_ROOT, {
  withCredentials: true,
  transports: ['websocket', 'polling']
})

injectStore(store);

const persistor = persistStore(store);

createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter basename="/">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <CssVarsProvider theme={theme}>
            <CssBaseline />
            <ConfirmProvider>
              <GlobalStyles
                styles={{
                  body: {
                    margin: 0,
                    padding: 0,
                    boxSizing: 'border-box',
                    fontFamily: 'Roboto, sans-serif',
                  },
                }}
              />
              <ToastContainer />
              <App />
            </ConfirmProvider>
          </CssVarsProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </>
);
