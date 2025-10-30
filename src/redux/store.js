import { configureStore } from '@reduxjs/toolkit';

import accountReducer from './slice/accountSlide';
import centerReducer from './slice/centerSlice';
import vaccineReducer from './slice/vaccineSlice';
import userReducer from './slice/userSlice';
import permissionReducer from './slice/permissionSlice';
import roleReducer from './slice/roleSlice';
import bookingReducer from './slice/bookingSlice';
import appointmentReducer from './slice/appointmentSlice';
import cartReducer from './slice/cartSlice';

import storage from 'redux-persist/lib/storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    account: accountReducer,
    appointment: appointmentReducer,
    cart: persistedReducer,
    booking: bookingReducer,
    center: centerReducer,
    vaccine: vaccineReducer,
    user: userReducer,
    permission: permissionReducer,
    role: roleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
