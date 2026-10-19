import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../utils/constants';
import {
  GetStatsResponse,
  GetUsersResponse,
  UserListItem,
  UserQuery,
} from '../../types/user';

export const userApiSlice = createApi({
  reducerPath: 'UserApi',
  tagTypes: ['Users', 'UserStats'],
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
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page !== undefined) queryParams.set('page', String(params.page));
        if (params.limit !== undefined) queryParams.set('limit', String(params.limit));
        if (params.search) queryParams.set('search', params.search);
        if (params.name) queryParams.set('name', params.name);
        if (params.email) queryParams.set('email', params.email);
        if (params.role) queryParams.set('role', params.role);
        if (params.isBlocked !== undefined && params.isBlocked !== '') {
          queryParams.set('isBlocked', String(params.isBlocked));
        }

        return {
          url: `/user/getUserByPage?${queryParams.toString()}`,
          method: 'POST',
        };
      },
      providesTags: ['Users'],
    }),

    getUserStats: builder.query<GetStatsResponse, void>({
      query: () => ({
        url: '/user/stats',
        method: 'GET',
      }),
      providesTags: ['UserStats'],
    }),

    toggleBlockUser: builder.mutation<any, number | string>({
      query: (userId) => ({
        url: `/user/${userId}/toggle-block`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Users', 'UserStats'],
    }),

    updateUserByAdmin: builder.mutation<any, { id: number | string; data: Partial<UserListItem> }>({
      query: ({ id, data }) => ({
        url: `/user/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Users', 'UserStats'],
    }),

    deleteUserByAdmin: builder.mutation<any, number | string>({
      query: (userId) => ({
        url: `/user/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users', 'UserStats'],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetUserStatsQuery,
  useToggleBlockUserMutation,
  useUpdateUserByAdminMutation,
  useDeleteUserByAdminMutation,
} = userApiSlice;
