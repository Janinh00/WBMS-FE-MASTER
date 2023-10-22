import { apiSlice } from "../apiSlice";

const API_URL = "/products";

const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (data) => ({
        url: `${API_URL}`,
        method: "GET",
      }),
      providesTags: ["product"],
    }),
    eDispatchProductSync: builder.mutation({
      query: () => ({
        url: `${API_URL}/edispatch-sync`,
        method: "GET",
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

export const { useGetProductsQuery, useEDispatchProductSyncMutation } = productApiSlice;