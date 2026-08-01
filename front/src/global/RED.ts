import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { ThemeReducer } from "./ThemeSlice";
import { UserReducer } from "./UserSlice";
import { UserAPI } from "./userAPI";

export const RED = configureStore({
    reducer: {
        theme: ThemeReducer,
        user: UserReducer,
        [UserAPI.reducerPath]: UserAPI.reducer,
    },      //  gDM = getDefaultMiddleware.
    middleware: (gDM) => gDM().concat(UserAPI.middleware),
});

setupListeners(RED.dispatch);
export type RootState = ReturnType <typeof RED.getState>;
export type AppDispatch = typeof RED.dispatch;



