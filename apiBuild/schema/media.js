"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "\n  type Media {\n    id: Int\n    author_id: Int\n    url: String\n    created_at: String\n  }\n\n  type MediaNode {\n    count: Int,\n    rows: [Media]\n  }\n\n  type DeleteResponse {\n    ok: Boolean!\n    id: Int\n  }\n\n  input Upload {\n    name: String!\n    type: String!\n    size: Int!\n    path: String!\n  }\n  \n  type Query {\n    media(id: Int, author_id: Int!, offset: Int, limit: Int, cursor: Int): MediaNode\n  }\n\n  type Mutation {\n    insertMedia(url: String): Media\n    deleteMedia(id: Int!): DeleteResponse\n\n  }\n";
//    uploadFile(file: Upload!):Boolean