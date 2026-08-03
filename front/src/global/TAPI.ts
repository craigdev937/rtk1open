import { createApi, 
    fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ITale, ITData } from "../models/Interfaces";
// The posters come back as "/api/tale/posters/x.jpg", so the
// pages need the bare origin to turn one into an <img> src.
export const HOST = "http://localhost:9000";
const URL = `${HOST}/api`;

export const TAPI = createApi({
    reducerPath: "TAPI",
    tagTypes: ["Tales"],
    baseQuery: fetchBaseQuery({
        baseUrl: URL,
        credentials: "include"
    }),
    endpoints: (builder) => ({
        tales: builder.query<ITData, void>({
            query: () => ({
                url: "/tale",
                method: "GET"
            }),
            providesTags: (result) => result ? [
                ...result.data.map(({ id }) => 
                    ({ type: "Tales" as const, id })),
                { type: "Tales", id: "LIST" },
            ] : [{ type: "Tales", id: "LIST" }]
        }),
    })
});



