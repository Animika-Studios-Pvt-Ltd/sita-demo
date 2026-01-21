import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../../../utils/baseURL';

const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/orders`,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Orders'],
      transformResponse: (response) => {
        return response;
      },
      transformErrorResponse: (error) => {
        console.error('❌ Order creation failed:', error);
        return error;
      },
    }),

    getOrderByUserId: builder.query({
      query: (userId) => {
        const encodedUserId = encodeURIComponent(userId);
        return `/user/${encodedUserId}`;
      },
      providesTags: (result, error, userId) => [
        { type: 'Orders', id: userId },
        'Orders'
      ],
      transformResponse: (response) => {
        return Array.isArray(response) ? response : [];
      },
      transformErrorResponse: (error) => {
        console.error('❌ Failed to fetch orders:', error);
        return [];
      },
    }),

    getAllOrders: builder.query({
      query: () => '/',
      providesTags: ['Orders'],
      transformResponse: (response) => {
        return response.orders || response || [];
      },
    }),

    updateOrder: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: updateData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Orders', id },
        'Orders'
      ],
      transformResponse: (response) => {
        return response;
      },
      transformErrorResponse: (error) => {
        console.error('❌ Order update failed:', error);
        return error;
      },
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderByUserIdQuery,
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
} = ordersApi;

export default ordersApi;
