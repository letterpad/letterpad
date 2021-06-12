import { createContext } from "react";
import { Setting } from "@/__generated__/__types__";

export const LetterpadContext = createContext<Setting | null>(null);

export const LetterpadProvider = LetterpadContext.Provider;
