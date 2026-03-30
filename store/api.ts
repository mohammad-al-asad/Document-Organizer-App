import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query";
import { clearSession, updateTokens } from "./auth";

const apiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");

type RootStateLike = {
  auth: {
    accessToken: string | null;
    refreshToken: string | null;
  };
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: apiUrl ?? "",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootStateLike).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQuery: BaseQueryFn<
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

  // If unauthorized, attempt to refresh the token
  if (
    result.error?.status === 401 &&
    (typeof args === "string" ? args : args.url) !== "/auth/refresh-token"
  ) {
    const refreshToken = (api.getState() as RootStateLike).auth.refreshToken;

    if (!refreshToken) {
      api.dispatch(clearSession());
      return result;
    }

    // Attempt token refresh
    const refreshResult = await rawBaseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const data = refreshResult.data as any;
      const tokens = data.data || data;
      api.dispatch(updateTokens(tokens));
      // Retry the original query
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
