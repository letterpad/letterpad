/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: uploadFile
// ====================================================

export interface uploadFile_uploadFile_post {
  __typename: "Post";
  id: number | null;
  cover_image: string | null;
}

export interface uploadFile_uploadFile {
  __typename: "Response";
  ok: boolean;
  post: uploadFile_uploadFile_post | null;
}

export interface uploadFile {
  uploadFile: uploadFile_uploadFile;
}

export interface uploadFileVariables {
  cover_image: string;
  id: number;
}
