import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../utils/constants';

interface UserQuery {
  page: number;
  name: string;
  email: string;
}

interface UserListItem {
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface GetUsersResponse {
  statusCode: number;
  message: string;
  data: {
    totalPage: number;
    result: UserListItem[];
  };
}

export const userApiSlice = createApi({
  reducerPath: 'UserApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const userinfoStr = localStorage.getItem('user');
      if (userinfoStr) {
        try {
          const userinfo = JSON.parse(userinfoStr);
          if (userinfo?.auth) {
            headers.set('Authorization', `Bearer ${userinfo.auth}`);
          }
        } catch {}
      }
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUser: builder.query<GetUsersResponse, UserQuery>({
      query: ({ page, name, email }) => ({
        url: `/user/getUserByPage/?page=${encodeURIComponent(page)}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`,
        method: 'POST',
      }),
    }),
  }),
});

export const { useGetUserQuery } = userApiSlice;
