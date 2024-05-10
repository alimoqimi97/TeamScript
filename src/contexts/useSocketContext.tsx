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
  RefObject,
} from "react";
import Peer, { MediaConnection } from "peerjs";
import { socket } from "@/socket";
import { User } from "@/types";
import { initialUser } from "@/constants";

interface IState {
  stream?: MediaStream;
  socketId?: string;
  myVideo?: RefObject<HTMLVideoElement>;
  users?: User[];
  addUser?: (user: User) => void;
  removeUser?: (user: User) => void;
}

const initialContextValue: IState = {
  stream: undefined,
  socketId: "",
  myVideo: undefined,
  users: [],
};

const SocketContext = createContext<IState>(initialContextValue);

export const useSocketContext = () => useContext(SocketContext);

type Action =
  | { type: "SET_STREAM"; payload: MediaStream }
  | { type: "SET_SOCKET_ID"; payload: string }
  | { type: "SET_MY_VIDEO"; payload?: RefObject<HTMLVideoElement> }
  | { type: "ADD_USER"; payload?: User }
  | { type: "REMOVE_USER"; payload?: User };

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
    case "SET_MY_VIDEO": {
      const newState: IState = {
        ...state,
        myVideo: action.payload,
      };

      return newState;
    }
    case "ADD_USER": {
      const users: User[] = state.users ?? [];
      users?.push(action?.payload ?? initialUser);

      const newState: IState = {
        ...state,
        users,
      };

      return newState;
    }
    case "REMOVE_USER": {
      const users: User[] = state?.users ?? [];

      const updatedUsers: User[] = users?.filter(
        (user: User) => user?.id !== action?.payload?.id
      );

      const newState: IState = {
        ...state,
        users: updatedUsers,
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

  console.log('users: ', state?.users);

  useEffect(() => {

    

    if (!navigator) {
      return;
    }

    const peer = new Peer({
      host: "localhost",
      port: 9000,
      path: "/myapp",
    });

    

    state?.stream || navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream: MediaStream) => {
        const action: Action = { type: "SET_STREAM", payload: currentStream };

        dispatch(action);

        if (myVideo?.current) {
          myVideo.current.srcObject = currentStream;
        }
      }).catch(err => console.error(err));

    socket.on("me", (id) => {
      const action: Action = { type: "SET_SOCKET_ID", payload: id };

      dispatch(action);
    });

    socket.on("user-disconnected", (userId) => {});

    peer.on("open", (id: string) => {
      const ROOM_ID: string = "room-id";

      socket.emit("join-room", ROOM_ID, id);
    });

    peer.on("call", (call: MediaConnection) => {
      call.answer(state.stream);
      
      call.on("stream", (remoteUserStream: MediaStream) => {
        dispatch({
          type: "ADD_USER",
          payload: { id: call?.peer, stream: remoteUserStream },
        });
      });
    });

    const connectToNewUser = (id: string, stream: MediaStream | undefined) => {
      
      const call = stream && peer.call(id, stream);

      call?.on("stream", (userVideoStream) => {
        dispatch({
          type: "ADD_USER",
          payload: { id, stream: userVideoStream },
        });
      });

      call?.on("close", () => {
        myVideo.current?.remove();
      });
    };

    socket.on("user-connected", (userId) => {
      console.log('===================user connected========================');
      
      connectToNewUser(userId, state.stream);
    });

  }, [state?.stream]);

  // const callUser = () => {};

  // const answerCall = () => {};

  // const leaveCall = () => {};

  const addUser = (user: User) => {
    const action: Action = { type: "ADD_USER", payload: user };
    dispatch(action);
  };

  const removeUser = (user: User) => {
    const action: Action = { type: "REMOVE_USER", payload: user };
    dispatch(action);
  };

  const value = useMemo(
    () => ({
      ...state,
      myVideo,
      addUser,
      removeUser,
    }),
    [state]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
