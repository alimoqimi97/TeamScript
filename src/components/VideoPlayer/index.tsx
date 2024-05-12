import { FC, SyntheticEvent, useEffect, useRef } from "react";
import styles from './styles.module.scss'
export interface IVideoPlayer {
  id: string;
  stream: MediaStream;
}

// type VideoProps = JSX.IntrinsicElements["video"] & IVideoPlayer;

const VideoPlayer: FC<IVideoPlayer> = ({ id, stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current.srcObject = stream;
    }
  }, [videoRef?.current]);

  return (
    <div className={styles['video-player']}>
      <video
        ref={videoRef}
        onLoadedMetadata={(event: SyntheticEvent<HTMLVideoElement, Event>) =>
          event.currentTarget.play()
        }
        muted={true}
      />
    </div>
  );
};
export default VideoPlayer;
