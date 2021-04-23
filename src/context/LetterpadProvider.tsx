import { createContext } from "react";
import { Setting } from "../../__generated__/src/graphql/type-defs.graphqls";

export const LetterpadContext = createContext<Setting | null>(null);

export const LetterpadProvider = LetterpadContext.Provider;
