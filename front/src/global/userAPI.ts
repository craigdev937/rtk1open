import { createApi,
    fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { IData, ILogRes, IMsg,
    IRegRes, IRes, IUser } from "../models/Interfaces";
import type { LType, RType } from "../validation/Schema";
const URL = "http://localhost:9000/api";

export const UserAPI = createApi({
    reducerPath: "UserAPI",
    tagTypes: ["Users"],
    baseQuery: fetchBaseQuery({
        baseUrl: URL,
        // The auth token is an httpOnly cookie, so every request
        // has to carry credentials for the server to see it.
        credentials: "include"
    }),
    endpoints: (builder) => ({
        all: builder.query<IData, void>({
            query: () => ({
                url: "/users",
                method: "GET"
            }),
            providesTags: (result) => result ? [
                ...result.data.map(({ id }) =>
                    ({ type: "Users" as const, id })),
                { type: "Users", id: "LIST" },
            ] : [{ type: "Users", id: "LIST" }]
        }),
        one: builder.query<IRes<IUser>, number>({
            query: (id) => ({
                url: `/users/${id}`,
                method: "GET"
            }),
            providesTags: ["Users"]
        }),
        me: builder.query<IRes<IUser>, void>({
            query: () => ({
                url: "/users/me",
                method: "GET"
            }),
            providesTags: ["Users"]
        }),
        reg: builder.mutation<IRegRes, RType>({
            query: (payload) => ({
                url: "/users/register",
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["Users"]
        }),
        log: builder.mutation<ILogRes, LType>({
            query: (payload) => ({
                url: `/users/login`,
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["Users"]
        }),
        logout: builder.mutation<IMsg, void>({
            query: () => ({
                url: "/users/logout",
                method: "POST"
            }),
            invalidatesTags: ["Users"]
        }),
        update: builder.mutation<IRes<IUser>, IUser>({
            query: ({id, ...payload}) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: payload
            }),
            invalidatesTags: ["Users"]
        }),
        delete: builder.mutation<IRes<IUser>, number>({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Users"]
        }),
    })
});




