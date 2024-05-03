"use client";

import {
  createContext,
  useReducer,
  useContext,
  FC,
  useMemo,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import Peer from "simple-peer";
import { socket } from "@/socket";

interface IState {
  stream?: MediaStream;
  socketId?: string;
}

const initialContextValue: IState = {
  stream: undefined,
  socketId: "",
};

const SocketContext = createContext<IState>(initialContextValue);

export const useSocketContext = () => useContext(SocketContext);

type Action =
  | { type: "SET_STREAM"; payload: MediaStream }
  | { type: "SET_SOCKET_ID"; payload: string };

function socketReducer(state: IState, action: Action) {
  switch (action.type) {
    case "SET_STREAM": {
      const newState: IState = {
        ...state,
        stream: action.payload,
      };

      return newState;
    }
    case "SET_SOCKET_ID": {
      const newState: IState = {
        ...state,
        socketId: action.payload,
      };

      return newState;
    }

    default:
      throw new Error("Unhandled Action type.");
  }
}

export const SocketProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(socketReducer, initialContextValue);
  const myVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream: MediaStream) => {
        const action: Action = { type: "SET_STREAM", payload: currentStream };

        dispatch(action);
        if (myVideo?.current) {
          myVideo.current.srcObject = currentStream;
        }
      });

    socket.on("me", (id) => {
      const action: Action = { type: "SET_SOCKET_ID", payload: id };

      dispatch(action);
    });

    const ROOM_ID: string = 'room id';
    const USER_ID: string = '10';

    socket.emit('join-room', ROOM_ID, USER_ID);

    socket.on('user-connected', userId => {
      console.log('user connected by id: ' + userId);
      
    })

  }, []);

  //   const setLanguage = (language: string) =>
  //     dispatch({ type: "SET_LANGUAGE ", payload: language });

  // const callUser = () => {};

  // const answerCall = () => {};

  // const leaveCall = () => {};

  const value = useMemo(
    () => ({
      ...state,
      // setLanguage,
    }),
    [state]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
