import { apiSlice } from "./apiSlice";

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: ({ chatId, message }) => ({
        url: `/message/send/${chatId}`,
        credentials: "include",
        method: "POST",
        body: { message },
      }),
      invalidatesTags: ['Message']
    }),
    deleteMessage: builder.mutation({
      query: ({ messageId }) => ({
        url: `/message/delete-message/${messageId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ['Message']
    }),
    getAllMessages: builder.query({
      query: ({ chatId }) => ({
        url: `/message/chat-messages/${chatId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags:['Message']
    }),
    updateMessageStatus: builder.mutation({
      query: ({messageId, status}) => ({
        method: 'PATCH',
        credentials: 'include',
        url: `/message/update-status/${messageId}`
      }),
      invalidatesTags: ['Message']
    })
  }),
});

export const {
  useSendMessageMutation,
  useDeleteMessageMutation,
  useGetAllMessagesQuery,
  useUpdateMessageStatusMutation
} = messageApiSlice;
