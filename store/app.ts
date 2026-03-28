import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");

type RootStateLike = {
  auth: { accessToken: string | null };
};

type ApiResponse<T> = { success: boolean; message: string; data: T };

const rawBase = fetchBaseQuery({
  baseUrl: apiUrl ?? "",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootStateLike).auth.accessToken;
    headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError | { status: string; data: { message: string } }
> = async (args, api, extraOptions) => {
  if (!apiUrl) {
    return {
      error: {
        status: "CUSTOM_ERROR",
        data: { message: "Missing EXPO_PUBLIC_API_URL" },
      },
    };
  }
  return rawBase(args, api, extraOptions);
};

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery,
  endpoints: (builder) => ({
    sendSupportReport: builder.mutation<
      ApiResponse<{
        userId: string;
        title: string;
        description: string;
        status: string;
      }>,
      { title: string; description: string }
    >({
      query: (body) => ({
        url: "/support",
        method: "POST",
        body,
      }),
    }),
    getCommonContent: builder.query<
      ApiResponse<{
        _id: string;
        aboutUs: string;
        termsAndCondition: string;
        privacyPolicy: string;
        createdAt: string;
        updatedAt: string;
      }>,
      void
    >({
      query: () => "/common",
    }),
  }),
});

export const { useSendSupportReportMutation, useGetCommonContentQuery } = appApi;
