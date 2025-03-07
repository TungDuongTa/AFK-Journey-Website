import { configureStore } from "@reduxjs/toolkit";
import introVideoReducer from "./introVideoSlice";

export const store = configureStore({
  reducer: {
    introVideo: introVideoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
