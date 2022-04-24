import { createContext } from "react";
import { Setting } from "@graphql-types@";

export const LetterpadContext = createContext<Setting | null>(null);

export const LetterpadProvider = LetterpadContext.Provider;
