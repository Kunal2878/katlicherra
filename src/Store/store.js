import { configureStore } from "@reduxjs/toolkit";
import userDataReducer from "./slice";
export const store = configureStore({
  reducer: {
    userData: userDataReducer,
  },
});
