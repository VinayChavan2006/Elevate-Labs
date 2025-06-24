import { apiSlice } from "./apiSlice";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllChats: builder.query({
      query: () => ({
        url: "/chat",
        credentials: "include",
        method: "GET",
      }),
      providesTags: ['Chat']
    }),
    getUserChats: builder.query({
      query: ({ userId }) => ({
        url: `/chat/user/${userId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags:['Chat']
    }),
    getChatDetails: builder.query({
      query: ({ chatId }) => ({
        url: `/chat/chat-details/${chatId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ['Chat']
    }),
    createPrivateChat: builder.mutation({
      query: ({ recieverId }) => ({
        url: `/chat/create-private/${recieverId}`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ['Chat']
    }),
    createGroupChat: builder.mutation({
      query: (data) => ({
        url: `/chat/create-group`,
        credentials: "include",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Chat']
    }),
    exitGroupChat: builder.mutation({
      query: ({ chatId }) => ({
        url: `/chat/exit/${chatId}`,
        credentials: "include",
        method: "POST",
      }),
      invalidatesTags: ['Chat']
    }),
    deletePrivateChat: builder.mutation({
      query: ({ chatId }) => ({
        url: `/chat/private/${chatId}`,
        credentials: "include",
        method: "DELETE",
      }),
      invalidatesTags: ['Chat']
    }),
    deleteGroupChat: builder.mutation({
      query: ({ chatId }) => ({
        url: `/chat/group/${chatId}`,
        credentials: "include",
        method: "DELETE",
      }),
      invalidatesTags: ['Chat']
    }),
    updateLastMessage: builder.mutation({
      query: ({ chatId, messageId }) => ({
        url: `/chat/update/last/${chatId}`,
        credentials: "include",
        method: "PATCH",
        body: {messageId}
      }),
      invalidatesTags: ['Chat']
    }),
  }),
});

export const {
  useGetAllChatsQuery,
  useGetUserChatsQuery,
  useGetChatDetailsQuery,
  useCreatePrivateChatMutation,
  useCreateGroupChatMutation,
  useExitGroupChatMutation,
  useDeletePrivateChatMutation,
  useDeleteGroupChatMutation,
  useUpdateLastMessageMutation
} = chatApiSlice;
