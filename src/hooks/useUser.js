import {
  useGetUsersQuery,
  useSearchManyUsersQuery,
  useSearchFirstUserMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../slices/user/userSliceApi";

export const useUser = () => {
  return { useGetUsersQuery, useSearchManyUsersQuery, useSearchFirstUserMutation, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation };
};
