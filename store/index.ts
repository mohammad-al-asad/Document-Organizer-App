import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import { appApi } from "./app";
import { authApi, authReducer, type AuthState } from "./auth";
import { documentApi } from "./document";
import { reminderApi } from "./reminder";

const persistedAuthReducer = persistReducer<AuthState>(
  {
    key: "auth",
    storage: AsyncStorage,
    whitelist: ["user", "accessToken", "refreshToken", "faceLockEnabled"],
  },
  authReducer,
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    [authApi.reducerPath]: authApi.reducer,
    [appApi.reducerPath]: appApi.reducer,
    [documentApi.reducerPath]: documentApi.reducer,
    [reminderApi.reducerPath]: reminderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(authApi.middleware, appApi.middleware, documentApi.middleware, reminderApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
