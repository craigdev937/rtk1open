import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { ThemeReducer } from "./ThemeSlice";
import { UserReducer } from "./UserSlice";
import { UAPI } from "./UAPI";
import { TAPI } from "./TAPI";

export const RED = configureStore({
    reducer: {
        theme: ThemeReducer,
        user: UserReducer,
        [UAPI.reducerPath]: UAPI.reducer,
        [TAPI.reducerPath]: TAPI.reducer,
    },      //  gDM = getDefaultMiddleware.
    middleware: (gDM) => gDM().concat([
            UAPI.middleware, 
            TAPI.middleware
        ])
});

setupListeners(RED.dispatch);
export type RootState = ReturnType <typeof RED.getState>;
export type AppDispatch = typeof RED.dispatch;



