import { BiLogOut } from "react-icons/bi";
import { BsEnvelope, BsImages, BsTags } from "react-icons/bs";
import { CiSettings } from "react-icons/ci";
import { HiOutlineUsers, HiTemplate } from "react-icons/hi";
import { MdManageAccounts } from "react-icons/md";
import { RiLayout4Line } from "react-icons/ri";
import { VscDebugDisconnect } from "react-icons/vsc";

export const items = (stats) => [
  {
    label: "Posts",
    icon: <BsEnvelope size={16} />,
    key: "/posts",
    badge: stats?.posts?.published.toString(),
  },
  {
    label: "Creatives",
    icon: <RiLayout4Line size={16} />,
    key: "/creatives",
    badge: stats?.pages?.published.toString(),
  },
  {
    label: "Media",
    icon: <BsImages size={16} />,
    key: "/media",
    badge: stats?.media?.toString(),
  },
  {
    label: "Tags",
    icon: <BsTags size={16} />,
    key: "/tags",
    badge: stats?.tags?.toString(),
  },
  {
    label: "Profile",
    icon: <MdManageAccounts size={16} />,
    key: "/profile",
  },
  {
    group: "Site",
    label: "",
    key: "site",
  },
  {
    label: "Themes",
    icon: <HiTemplate size={16} />,
    key: "/themes",
  },
  {
    label: "Domain Mapping",
    icon: <VscDebugDisconnect size={16} />,
    key: "/domain-mapping",
  },
  {
    label: "Settings",
    icon: <CiSettings size={16} />,
    key: "/settings",
  },
  {
    label: "Subscribers",
    icon: <HiOutlineUsers size={16} />,
    key: "/subscribers",
  },
  // {
  //   label: "Membership",
  //   icon: <CiSettings size={16}/>,
  //   key: "/membership",
  // },
  {
    label: "Logout",
    icon: <BiLogOut size={16} />,
    key: "/logout",
    testid: "logout",
  },
];
