import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./api";

type ApiResponse<T> = { success: boolean; message: string; data: T };


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
  tagTypes: ["Document", "Documents"],
  endpoints: (builder) => ({
    uploadDocument: builder.mutation<ApiResponse<any>, FormData>({
      query: (body) => ({
        url: "/document/upload",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Documents"],
    }),
    confirmDocument: builder.mutation<ApiResponse<any>, any>({
      query: (body) => ({
        url: "/document/confirm",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Documents"],
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
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id: id }) => ({ type: "Document" as const, id })),
              { type: "Documents", id: "LIST" },
            ]
          : [{ type: "Documents", id: "LIST" }],
    }),
    getDocumentById: builder.query<ApiResponse<DocumentItem>, string>({
      query: (documentId) => `/document/${documentId}`,
      providesTags: (result, error, id) => [{ type: "Document" as const, id }],
    }),
    updateDocument: builder.mutation<ApiResponse<DocumentItem>, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/document/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Document" as const, id },
        { type: "Documents", id: "LIST" },
      ],
    }),
    deleteDocument: builder.mutation<ApiResponse<any>, string>({
      query: (documentId) => ({
        url: `/document/${documentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Document" as const, id },
        { type: "Documents", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useUploadDocumentMutation,
  useConfirmDocumentMutation,
  useGetDocumentsQuery,
  useGetDocumentByIdQuery,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
} = documentApi;
