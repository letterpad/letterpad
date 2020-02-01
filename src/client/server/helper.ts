import getRoutes from "../routes";
import { matchPath, match } from "react-router";

export const getMatchedRouteData = (initialData, requestUrl) => {
  let match: match<{}> | null = null;
  const routes = getRoutes(initialData);
  for (let i = 0; i < routes.length; i++) {
    match = matchPath(requestUrl, routes[i]);
    if (match) break;
  }
  return match;
};
