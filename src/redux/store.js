import { configureStore } from '@reduxjs/toolkit';
import { activeBoardReducer } from './activeBoard/activeBoardSlice';
import { userReducer } from './user/userSlice';
import {cardReducers} from './CardActivity/cardActiveSlice'
import {commentReducers} from './CommentCard/commentCardSlice'
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import {notificationReducers} from "./Notification/NotificationSlice"

const rootPersistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['user'], // cac silce du lieu duoc luu lai sau moi lan f5 trinh duyet
};
const rootReducer = combineReducers({
  user: userReducer,
  activeBoard: activeBoardReducer,
  cardActive:cardReducers,
  commentCard:commentReducers,
  notification:notificationReducers
});

export const store = configureStore({
  reducer: persistReducer(rootPersistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
     devTools: true 
});

