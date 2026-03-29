import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");

import { clearSession, updateTokens } from "./auth";

type RootStateLike = {
  auth: { accessToken: string | null; refreshToken: string | null };
};

type ApiResponse<T> = { success: boolean; message: string; data: T };

const rawBase = fetchBaseQuery({
  baseUrl: apiUrl ?? "",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootStateLike).auth.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

function getRequestUrl(args: string | FetchArgs) {
  return typeof args === "string" ? args : args.url;
}

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

  let result = await rawBase(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshToken = (api.getState() as RootStateLike).auth.refreshToken;

    if (!refreshToken) {
      api.dispatch(clearSession());
      return result;
    }

    // Attempt token refresh on the auth service
    const refreshResult = await fetch(`${apiUrl}/auth/refresh-token`, {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (refreshResult.ok) {
      const data = await refreshResult.json();
      const tokens = "data" in data ? data.data : data;
      api.dispatch(updateTokens(tokens));
      // Retry the original query
      result = await rawBase(args, api, extraOptions);
    } else {
      api.dispatch(clearSession());
      return {
        error: {
          status: "CUSTOM_ERROR",
          data: { message: "Session expired" },
        },
      };
    }
  }

  return result;
};

export interface DocumentItem {
  _id: string;
  originalName: string;
  title: string;
  mimeType: string;
  size: number;
  s3Key: string;
  fileUrl: string;
  extractedData: any;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
  documentCategory: string;
}

export interface GetDocumentsResponse {
  data: DocumentItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const documentApi = createApi({
  reducerPath: "documentApi",
  baseQuery,
  endpoints: (builder) => ({
    uploadDocument: builder.mutation<ApiResponse<any>, FormData>({
      query: (body) => ({
        url: "/document/upload",
        method: "POST",
        body,
      }),
    }),
    confirmDocument: builder.mutation<ApiResponse<any>, any>({
      query: (body) => ({
        url: "/document/confirm",
        method: "POST",
        body,
      }),
    }),
    getDocuments: builder.query<
      ApiResponse<DocumentItem[]> & { total?: number; page?: number; totalPages?: number },
      { documentCategory?: string; page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: "/document",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const {
  useUploadDocumentMutation,
  useConfirmDocumentMutation,
  useGetDocumentsQuery,
} = documentApi;
