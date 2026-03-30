import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./api";

export interface Reminder {
  _id: string;
  documentId: string;
  userId: string;
  remindAt: string;
  title: string;
  message: string;
  recurrence: "none" | "daily" | "weekly" | "monthly" | "yearly";
  notificationChannels: {
    email: boolean;
    push: boolean;
  };
  status: "pending" | "sent" | "failed";
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderRequest {
  documentId: string;
  remindAt: string; // ISO string
  title: string;
  message: string;
  recurrence: string;
  notificationChannels: {
    email: boolean;
    push: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const reminderApi = createApi({
  reducerPath: "reminderApi",
  baseQuery,
  tagTypes: ["Reminders"],
  endpoints: (builder) => ({
    getReminders: builder.query<ApiResponse<Reminder[]>, string | void>({
      query: (filter) => ({
        url: "/reminder/me",
        params: { filter: filter || "all" },
      }),
      providesTags: ["Reminders"],
    }),
    createReminder: builder.mutation<ApiResponse<Reminder>, CreateReminderRequest>({
      query: (body) => ({
        url: "/reminder",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reminders"],
    }),
    updateReminder: builder.mutation<ApiResponse<Reminder>, { id: string; body: Partial<CreateReminderRequest> }>({
      query: ({ id, body }) => ({
        url: `/reminder/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => ["Reminders", { type: "Reminders", id }],
    }),
    deleteReminder: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/reminder/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reminders"],
    }),
  }),
});

export const {
  useGetRemindersQuery,
  useCreateReminderMutation,
  useUpdateReminderMutation,
  useDeleteReminderMutation,
} = reminderApi;
