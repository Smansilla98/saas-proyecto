'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Lazy load react-player para mejor performance
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface VideoPlayerProps {
  url: string;
}

export function VideoPlayer({ url }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
      <ReactPlayer
        url={url}
        playing={playing}
        controls={true}
        width="100%"
        height="100%"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
    </div>
  );
}

