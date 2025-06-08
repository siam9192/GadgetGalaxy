import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import cartSlice from "./features/cart/cart.slice";
export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    cartSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck:true}).concat(baseApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
