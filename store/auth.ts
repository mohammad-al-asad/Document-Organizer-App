import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");

export type User = {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  twoFactorEnabled: boolean;
  createdAt?: string;
  updatedAt?: string;
  notificationPreferences?: {
    email?: boolean;
    push?: boolean;
  };
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type Tokens = {
  accessToken: string;
  refreshToken: string;
};


type RootStateLike = {
  auth: {
    accessToken: string | null;
    refreshToken: string | null;
  };
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

const rawBaseQuery = fetchBaseQuery({
  baseUrl: apiUrl ? `${apiUrl}/auth` : "",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootStateLike).auth.accessToken;

    headers.set("Content-Type", "application/json");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

function getTokensFromResponse(response: Tokens | ApiResponse<Tokens>) {
  return "data" in response ? response.data : response;
}

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

  let result = await rawBaseQuery(args, api, extraOptions);

  if (
    result.error?.status === 401 &&
    getRequestUrl(args) !== "/refresh-token"
  ) {
    const refreshToken = (api.getState() as RootStateLike).auth.refreshToken;

    if (!refreshToken) {
      api.dispatch(clearSession());
      return result;
    }

    const refreshResult = await rawBaseQuery(
      {
        url: "/refresh-token",
        method: "POST",
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      },
      api,
      extraOptions,
    );

    if ("data" in refreshResult && refreshResult.data) {
      const tokens = getTokensFromResponse(
        refreshResult.data as Tokens | ApiResponse<Tokens>,
      );

      api.dispatch(updateTokens(tokens));
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearSession());

      return {
        error: refreshResult.error ?? {
          status: "CUSTOM_ERROR",
          data: { message: "Session expired" },
        },
      };
    }
  }

  return result;
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
        url: "/register",
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
        url: "/login",
        method: "POST",
        body,
      }),
    }),
    sendOtp: builder.mutation<
      ApiResponse<{ email: string; expiresAt: string; otp?: number }>,
      { email: string }
    >({
      query: (body) => ({
        url: "/send-otp",
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
        url: "/verify-otp",
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
        url: "/set-new-password",
        method: "POST",
        body,
      }),
    }),
    updateProfile: builder.mutation<
      ApiResponse<User>,
      {
        fullName?: string;
        email?: string;
        phoneNumber?: string;
        address?: string;
        profileImage?: string;
        dateOfBirth?: string;
        country?: string;
      }
    >({
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
    refreshSession: builder.mutation<Tokens, void>({
      async queryFn(_arg, api, extraOptions) {
        const refreshToken = (api.getState() as RootStateLike).auth
          .refreshToken;

        if (!refreshToken) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: { message: "Missing refresh token" },
            },
          };
        }

        const result = await rawBaseQuery(
          {
            url: "/refresh-token",
            method: "POST",
            headers: {
              Cookie: `refreshToken=${refreshToken}`,
            },
          },
          api,
          extraOptions,
        );

        if ("error" in result) {
          return {
            error: result.error ?? {
              status: "CUSTOM_ERROR",
              data: { message: "Could not refresh session" },
            },
          };
        }

        const tokens = getTokensFromResponse(
          result.data as Tokens | ApiResponse<Tokens>,
        );

        return { data: tokens };
      },
    }),
    logout: builder.mutation<{ success: boolean; message: string }, void>({
      async queryFn(_arg, api, extraOptions) {
        const refreshToken = (api.getState() as RootStateLike).auth
          .refreshToken;

        const result = await rawBaseQuery(
          {
            url: "/logout",
            method: "POST",
            headers: refreshToken
              ? {
                  Cookie: `refreshToken=${refreshToken}`,
                }
              : undefined,
          },
          api,
          extraOptions,
        );

        if ("error" in result) {
          return {
            error: result.error ?? {
              status: "CUSTOM_ERROR",
              data: { message: "Could not log out" },
            },
          };
        }

        return { data: result.data as { success: boolean; message: string } };
      },
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
