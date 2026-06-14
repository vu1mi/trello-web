import {configureStore} from '@reduxjs/toolkit';
import { activeBoardReducer } from './activeBoard/activeBoardSlice';
import { userReducer } from './user/userSlice';
import {combineReducers} from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const rootPersistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['user'] // cac silce du lieu duoc luu lai sau moi lan f5 trinh duyet
}
const rootReducer = combineReducers({
  user: userReducer,
  activeBoard: activeBoardReducer
})

export const store = configureStore({
  reducer: persistReducer(rootPersistConfig, rootReducer),
  mmiddleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

// export const persistor = persistStore(store);
