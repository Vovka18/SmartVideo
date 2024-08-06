import { configureStore } from "@reduxjs/toolkit";
import { reducerUser } from "./slices/userSlice";
import { reducerRecomendation } from "./slices/recomendationSlice";
import { reducerVideo } from "./slices/videoSlice";

export const store = configureStore({
    reducer: {reducerUser, reducerRecomendation, reducerVideo}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;