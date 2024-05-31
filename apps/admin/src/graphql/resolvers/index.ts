import Author from "./author";
import Comment from "./comment";
import Domain from "./domain";
import Media from "./media";
import Notification from "./notification";
import Post from "./post";
import Setting from "./setting";
import Sitemap from "./sitemap";
import Subscriber from "./subscriber";
import Tag from "./tag";
import Badge from "./badge"; // Importing the badge resolver

export const resolversArr = [
  Author,
  Post,
  Setting,
  Media,
  Tag,
  Subscriber,
  Domain,
  Sitemap,
  Notification,
  Comment,
  Badge // Adding the badge resolver to the array of resolvers
];
