/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { EnumRoles } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL query operation: getRoles
// ====================================================

export interface getRoles_roles {
  __typename: "Role";
  id: number | null;
  name: EnumRoles | null;
}

export interface getRoles {
  roles: getRoles_roles[];
}
