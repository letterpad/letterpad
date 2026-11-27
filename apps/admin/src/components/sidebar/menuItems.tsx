import {
  FiBarChart2,
  FiEdit3,
  FiGlobe,
  FiGrid,
  FiLayers,
  FiSettings,
  FiStar,
  FiTag,
  FiUser,
  FiUsers,
} from "react-icons/fi";

export const menuGroups = [
  {
    label: "Publishing",
    items: [
      { label: "Posts", href: "/posts", icon: FiEdit3 },
      { label: "Creatives", href: "/creatives", icon: FiGrid },
      { label: "Tags", href: "/tags", icon: FiTag },
    ],
  },
  {
    label: "Website",
    items: [
      { label: "Themes", href: "/themes", icon: FiLayers },
      { label: "Domain Mapping", href: "/domain-mapping", icon: FiGlobe },
      { label: "Settings", href: "/settings", icon: FiSettings },
    ],
  },
  {
    label: "Audience",
    items: [
      { label: "Analytics", href: "/analytics", icon: FiBarChart2 },
      { label: "Subscribers", href: "/subscribers", icon: FiUsers },
    ],
  },
];

export const accountItems = [
  { label: "Profile", href: "/profile", icon: FiUser },
  { label: "Membership", href: "/membership", icon: FiStar },
];
