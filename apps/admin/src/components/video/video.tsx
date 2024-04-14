import { FC, useEffect, useRef, useState } from "react";
import videojs, { VideoJsPlayer } from "video.js";

import "./style.css";
import "video.js/dist/video-js.css";
// import "videojs-font/css/videojs-icons.css";
// import SpeedControl from "./speed-control";

interface VideoPlayerProps {
  options: videojs.PlayerOptions;
  onReady?: (player: VideoJsPlayer) => void;
}

const initialOptions: videojs.PlayerOptions = {
  controls: true,
  fluid: true,
  responsive: true,
  autoplay: true,
  width: 576,
  height: 324,
  playbackRates: [0.5, 1, 1.5, 2],
  controlBar: {
    volumePanel: {
      inline: false,
    },
  },
};

export const VideoPlayer: FC<VideoPlayerProps> = ({
  options = initialOptions,
  onReady,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);
  const [playbackRate] = useState(1);

  useEffect(() => {
    const mergedOptions = { ...initialOptions, ...options };
    if (!playerRef.current && videoRef.current) {
      const player = (playerRef.current = videojs(
        videoRef.current as Element,
        mergedOptions,
        () => {
          videojs.log("player is ready");
          onReady && onReady(player);
        }
      ));
      player.options({ enableSmoothSeeking: true });
    } else {
      const player = playerRef.current;

      player?.autoplay(!!mergedOptions.autoplay);
      if (mergedOptions.sources) {
        player?.src(mergedOptions.sources);
      }
    }
  }, [onReady, options, videoRef]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.playbackRate(playbackRate);
    }
  }, [playbackRate]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        // player.dispose();
        // playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div className="relative">
      <div className="absolute -left-[1px] -top-[1px] w-[calc(100%+2px)] h-[calc(100%+2px)] animate-pulse big-shadow rounded-lg bg-gradient"></div>
      <div className="absolute -left-[1px] -top-[1px] w-[calc(100%+2px)] h-[calc(100%+2px)]">
        {/* <span className="card__line card__line_left"></span> */}
        {/* <span className="card__line card__line_right animate-pulse"></span>
        <span className="card__line card__line_top"></span> */}
        {/* <span className="card__line card__line_bottom"></span> */}
      </div>
      <video
        ref={videoRef}
        className="video-js  md:rounded-lg vjs-theme-city vjs-big-play-centered"
        width="100%"
        height="100%"
      />
      <style>
        {`
        .big-shadow {
          animation-duration: 4s;
          border: 1px solid rgba(31,52,85,0.7);
        }
          .video-js {
          
              border-radius: 50px;

          }
          .vjs-poster {
            background-size: cover;
            border-radius: 10px;
            background-position: 0 0;
            
          }
          .vjs-tech {
            border-radius: 10px;
          }
          .video-js .vjs-control-bar {
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
          }
            
            `}
      </style>
    </div>
  );
};

export default VideoPlayer;
