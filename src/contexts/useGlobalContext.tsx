import { LANGUAGES } from "@/constants";
import { Language } from "@/types";
import React, {
  createContext,
  useReducer,
  useContext,
  FC,
  useMemo,
  ReactNode,
} from "react";

interface IState {
  language: string;
  setLanguage?: (language: string) => void
}

const initialContextValue: IState = {
  language: LANGUAGES[0]?.name ?? 'javascript',
};

const GlobalContext = createContext<IState>(initialContextValue);

export const useGlobalContext = () => useContext(GlobalContext);

type Action = { type: "SET_LANGUAGE "; payload: string };

function globalReducer(state: IState, action: Action) {
  switch (action.type) {
    case "SET_LANGUAGE ":
      return {
        ...state,
        language: action.payload,
      };
    default:
      throw new Error("Unhandled Action type.");
  }
}

export const GlobalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialContextValue);

  const setLanguage = (language: string) =>
    dispatch({ type: "SET_LANGUAGE ", payload: language });

  const value = useMemo(
    () => ({
      ...state,
      setLanguage,
    }),
    [state]
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};
