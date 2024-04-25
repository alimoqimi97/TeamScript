"use client";

import {
  createContext,
  useReducer,
  useContext,
  FC,
  useMemo,
  ReactNode,
} from "react";
import { LANGUAGES } from "@/constants";

interface IState {
  language: string;
  setLanguage?: (language: string) => void;
  theme: string;
  setTheme?: (theme: string) => void;
}

const initialContextValue: IState = {
  language: LANGUAGES[0]?.name ?? "python",
  theme: "vs-dark",
};

const GlobalContext = createContext<IState>(initialContextValue);

export const useGlobalContext = () => useContext(GlobalContext);

type Action =
  | { type: "SET_LANGUAGE "; payload: string }
  | { type: "SET_THEME"; payload: string };

function globalReducer(state: IState, action: Action) {
  switch (action.type) {
    case "SET_LANGUAGE ":
      return {
        ...state,
        language: action.payload,
      };
    case "SET_THEME":
      return {
        ...state,
        theme: action.payload,
      };
    default:
      throw new Error("Unhandled Action type.");
  }
}

export const GlobalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialContextValue);

  const setLanguage = (language: string) =>
    dispatch({ type: "SET_LANGUAGE ", payload: language });

  const setTheme = (theme: string) =>
    dispatch({ type: "SET_THEME", payload: theme });

  const value = useMemo(
    () => ({
      ...state,
      setLanguage,
      setTheme
    }),
    [state]
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};
