import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URI,
  credentials: 'include'
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User", "Message", "Chat"],
  endpoints: () => ({}),
});
