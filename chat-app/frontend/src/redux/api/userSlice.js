import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/users/login",
        credentials: "include",
        body: data,
        method: "POST",
      }),
      invalidatesTags: ['User']
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/users/register",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ['User']
    }),
    updateUserStatus: builder.mutation({
      query: ({userId,status}) => ({
        method: 'PATCH',
        url: `/users/update-status/${userId}`,
        credentials: 'include',
        body: {status}
      }),
      invalidatesTags: ['User']
    }),
    getProfile: builder.query({
      query: ({userId}) => ({
        url: "/users/profile/" + userId,
        credentials: "include",
        method: "GET",
      }),
      providesTags: ['User']
    }),
    getAllUsers: builder.query({
      query: ()=>({
        url : '/users/',
        method:'GET',
        credentials: 'include'
      }),
      providesTags: ['User']
    }),
    editProfile: builder.mutation({
      query: (data) => ({
        url: "/users/edit-profile",
        credentials: "include",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['User']
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/users/logout",
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags:['User']
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useEditProfileMutation,
  useLogoutMutation,
  useGetAllUsersQuery,
  useUpdateUserStatusMutation
} = userApiSlice;
