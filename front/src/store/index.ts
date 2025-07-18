import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import musicSlice from './musicSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    music: musicSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredPaths: ['music.userAnalytics.audioFeaturesSummary'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
