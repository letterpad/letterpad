import { createContext, useContext, useMemo } from "react";

import { useHomeQueryQuery } from "@/__generated__/src/graphql/queries/queries.graphql";

import { isAuthor, isSettings, isStats } from "../../utils/type-guards";
import { Author, Setting, Stats } from "../../../__generated__/__types__";

interface Context {
  me?: Author;
  settings?: Setting;
  stats?: Stats;
}
const SettingsAndMeContext = createContext<Context>({});

export const SettingsAndMeProvider = ({ children, loggedIn }) => {
  const { data } = useHomeQueryQuery({
    skip: !loggedIn,
  });

  const me = data && isAuthor(data.me) ? data.me : undefined;
  const settings =
    data && isSettings(data.settings) ? data.settings : undefined;
  const stats = data && isStats(data.stats) ? data.stats : undefined;

  const value = useMemo(() => ({ me, settings, stats }), [me, settings, stats]);
  return (
    <SettingsAndMeContext.Provider value={value}>
      {children}
    </SettingsAndMeContext.Provider>
  );
};

export const useMeAndSettingsContext = () => {
  return useContext(SettingsAndMeContext);
};
