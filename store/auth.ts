import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "./api";

const apiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");

export type User = {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  twoFactorEnabled: boolean;
  createdAt?: string;
  updatedAt?: string;
  profileImage?: string;
  notificationPreferences?: {
    email?: boolean;
    push?: boolean;
  };
  dateOfBirth?: string;
  country?: string;
  phoneNumber?: string;
  address?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  faceLockEnabled: boolean;
  faceLockVerified: boolean;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  faceLockEnabled: false,
  faceLockVerified: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User } & Tokens>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.faceLockVerified = true;
    },
    updateTokens: (state, action: PayloadAction<Tokens>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    clearSession: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.faceLockVerified = false;
    },
    setFaceLockEnabled: (state, action: PayloadAction<boolean>) => {
      state.faceLockEnabled = action.payload;
      state.faceLockVerified = action.payload
        ? Boolean(state.accessToken)
        : true;
    },
    setFaceLockVerified: (state, action: PayloadAction<boolean>) => {
      state.faceLockVerified = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    register: builder.mutation<
      ApiResponse<User>,
      {
        fullName: string;
        email: string;
        password: string;
        confirmPassword: string;
        twoFactorEnabled: boolean;
      }
    >({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<
      ApiResponse<{ user: User } & Tokens>,
      {
        email: string;
        password: string;
      }
    >({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    sendOtp: builder.mutation<
      ApiResponse<{ email: string; expiresAt: string; otp?: number }>,
      { email: string }
    >({
      query: (body) => ({
        url: "/auth/send-otp",
        method: "POST",
        body,
      }),
    }),
    verifyOtp: builder.mutation<
      { success: boolean; message: string },
      {
        email: string;
        otp: string;
      }
    >({
      query: (body) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body,
      }),
    }),
    setNewPassword: builder.mutation<
      { success: boolean; message: string },
      {
        email: string;
        newPassword: string;
        confirmPassword: string;
      }
    >({
      query: (body) => ({
        url: "/auth/set-new-password",
        method: "POST",
        body,
      }),
    }),
    changePassword: builder.mutation<
      { success: boolean; message: string },
      {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
      }
    >({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
    }),
    updateProfile: builder.mutation<ApiResponse<User>, FormData>({
      query: (body) => ({
        url: "/user/me",
        method: "PATCH",
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) {
            dispatch(setUser(data.data));
          }
        } catch {
          // ignore
        }
      },
    }),
    refreshSession: builder.mutation<ApiResponse<Tokens>, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
    }),
    logout: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshSessionMutation,
  useRegisterMutation,
  useSendOtpMutation,
  useSetNewPasswordMutation,
  useVerifyOtpMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;

export const {
  clearSession,
  setCredentials,
  setFaceLockEnabled,
  setFaceLockVerified,
  setUser,
  updateTokens,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
