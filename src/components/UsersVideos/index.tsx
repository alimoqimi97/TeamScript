import { FC } from "react";
import styles from "./styles.module.scss";
import { useSocketContext } from "@/contexts/useSocketContext";
import { User } from "@/types";
import VideoPlayer from "../VideoPlayer";

export interface IUsersVideos {}

const UsersVideos: FC = () => {
  const { users, stream } = useSocketContext();

  return (
    <div className={styles["users-videos"]}>
      <VideoPlayer id={"current-user"} stream={stream ?? new MediaStream()} />
      
      {users?.map((user: User) => (
        <VideoPlayer
          key={user?.id}
          id={user?.id ?? ""}
          stream={user?.stream ?? new MediaStream()}
        />
      ))}
    </div>
  );
};

export default UsersVideos;
