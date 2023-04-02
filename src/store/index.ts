import { configureStore } from "@reduxjs/toolkit";
import type { Middleware } from "redux";
import { useDispatch } from "react-redux";

import { createLogger } from "redux-logger";
import reducer from "../reducers";

const middlewares: Middleware[] = [];

if (process.env.NODE_ENV === "development") {
  middlewares.push(createLogger());
}

export const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middlewares),
  devTools: true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
