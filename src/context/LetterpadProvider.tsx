import { createContext } from "react";
import { Setting } from "@/generated";

export const LetterpadContext = createContext<Setting | null>(null);

export const LetterpadProvider = LetterpadContext.Provider;
