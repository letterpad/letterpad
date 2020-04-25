import { EnumPermissions } from "../../../__generated__/gqlTypes";
import { IAdminMenu } from "./../../../types/types";

const DATA: IAdminMenu[] = [
  {
    id: 1,
    name: "menu.allPosts",
    priority: 1,
    permissions: [],
    slug: "posts",
    icon: "fa-envelope",
  },
  {
    id: 1,
    name: "menu.allPages",
    priority: 1,
    permissions: [],
    slug: "pages",
    icon: "fa-copy",
  },
  {
    id: 3,
    name: "menu.media",
    priority: 3,
    permissions: [
      EnumPermissions.ManageOwnPosts,
      EnumPermissions.ManageAllPosts,
    ],
    slug: "media",
    icon: "fa-picture-o",
  },
  {
    id: 3,
    name: "menu.tags",
    priority: 3,
    permissions: [
      EnumPermissions.ManageOwnPosts,
      EnumPermissions.ManageAllPosts,
    ],
    slug: "tags",
    icon: "fa-tag",
  },
  {
    id: 10,
    name: "",
    priority: 0,
    permissions: [],
    slug: "",
    icon: "",
  },
  {
    id: 6,
    name: "menu.profile",
    priority: 3,
    permissions: [EnumPermissions.ManageOwnPosts],
    slug: "edit-profile",
    icon: "fa-user",
  },
  {
    id: 7,
    name: "menu.authors",
    priority: 3,
    permissions: [EnumPermissions.ManageUsers],
    slug: "authors",
    icon: "fa-users",
  },
  {
    id: 5,
    name: "menu.sitesettings",
    priority: 3,
    permissions: [EnumPermissions.ManageSettings],
    slug: "settings",
    icon: "fa-user",
  },
  {
    id: 11,
    name: "menu.logout",
    priority: 3,
    permissions: [],
    slug: "logout",
    icon: "fa-user",
  },
];

export default DATA;
