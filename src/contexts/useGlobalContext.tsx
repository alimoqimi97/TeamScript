import { LANGUAGES } from "@/constants";
import { Language } from "@/types";
import React, {
  createContext,
  useReducer,
  useContext,
  Dispatch,
  FC,
  useMemo,
  ReactNode,
} from "react";

interface IState {
  language: Language;
}

const initialContextValue: IState = {
  language: LANGUAGES[0],
};

const GlobalContext = createContext<IState>(initialContextValue);

type Action = { type: "SET_LANGUAGE "; payload: Language };

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

export const MemberProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialContextValue);

  const setLanguage = (language: Language) =>
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

type SelectorFunction<T> = (state: IState) => T;

export const useMemberState = <T extends {}>(
  selector?: Maybe<SelectorFunction<T>>
) => {
  const state = useContext(GlobalContext);
  if (!state) throw new Error("MemberStateContext cannot be provided.");

  if (!selector) {
    throw new Error("Cannot resolve selector.");
  }
  return selector(state);
};

export const useMemberDispatch = () => {
  const dispatch = useContext(MemberDispatchContext);
  if (!dispatch) throw new Error("MemberDispatchContext cannot be provided.");
  return dispatch;
};
