import { graphql } from "@apollo/react-hoc";
import {
  FORGOT_PASSWORD_QUERY,
  LOGIN_QUERY,
  RESET_PASSWORD_QUERY,
} from "../../shared/queries/Mutations";

export const updateQueryWithData = graphql(LOGIN_QUERY, {
  props: ({ mutate }) =>
    mutate && {
      login: data =>
        mutate({
          variables: data,
        }),
    },
});

export const forgotPassword = graphql(FORGOT_PASSWORD_QUERY, {
  props: ({ mutate }) =>
    mutate && {
      forgotPassword: data =>
        mutate({
          variables: data,
        }),
    },
});

export const resetPasswordQuery = graphql(RESET_PASSWORD_QUERY, {
  props: ({ mutate }) =>
    mutate && {
      resetPassword: data =>
        mutate({
          variables: data,
        }),
    },
});
