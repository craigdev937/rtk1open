import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IAuthUser, UserState } from "../models/Interfaces";

const initialState: UserState = {
    user: null,
    isAuth: false
};

const Userslice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        // Called after a successful register or login.
        setUser: (state, action: PayloadAction<IAuthUser>) => {
            state.user = action.payload;
            state.isAuth = true;
        },
        // Called after logout, or when /users/me rejects us.
        clearUser: (state) => {
            state.user = null;
            state.isAuth = false;
        },
    }
});

export const { setUser, clearUser } = Userslice.actions;
export const UserReducer = Userslice.reducer;


