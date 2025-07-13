import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  GetKpisResponse,
  GetProductsResponse,
  GetTransactionsResponse,
  GetStateRevenueResponse,
  GetCustomersResponse,
  GetSuggestionsResponse,
} from "./types";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  reducerPath: "main",
  tagTypes: ["Kpis", "Products", "Transactions", "StateRevenue", "Customers", "Suggestions"],
  endpoints: (build) => ({
    getKpis: build.query<Array<GetKpisResponse>, void>({
      query: () => "kpi/kpis/",
      providesTags: ["Kpis"],
    }),
    getProducts: build.query<Array<GetProductsResponse>, void>({
      query: () => "product/products/",
      providesTags: ["Products"],
    }),
    getTransactions: build.query<Array<GetTransactionsResponse>, void>({
      query: () => "transaction/transactions/",
      providesTags: ["Transactions"],
    }),
    getStateRevenues: build.query<Array<GetStateRevenueResponse>, void>({
      query: () => "staterevenue/staterevenues/",
      providesTags: ["StateRevenue"],
    }),
    getCustomers: build.query<Array<GetCustomersResponse>, void>({
      query: () => "customer/customers/",
      providesTags: ["Customers"],
    }),
    getSuggestions: build.query<Array<GetSuggestionsResponse>, void>({
      query: () => "suggestion/suggestions/",
      providesTags: ["Suggestions"],
    })
  }),
});

export const { useGetKpisQuery, useGetProductsQuery, useGetTransactionsQuery, useGetStateRevenuesQuery, useGetCustomersQuery, useGetSuggestionsQuery } =
  api;
