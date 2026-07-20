'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useSocketSettings } from '@/src/providers/SocketSettingsProvider';
import { resolveImageUrl } from '@/src/utils/image';

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function HomeVideoSection() {
  const { homeVideoUrl, homeVideoEnabled } = useSocketSettings();
  const [isMuted, setIsMuted] = useState(true);
  const youtubePlayerRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const youtubeId = homeVideoUrl ? getYouTubeId(homeVideoUrl) : null;

  useEffect(() => {
    if (homeVideoEnabled && homeVideoUrl && youtubeId) {
      // Load YouTube SDK if not present
      if (!(window as any).YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      // Check periodically for YT object and element
      const checkYT = setInterval(() => {
        if ((window as any).YT && (window as any).YT.Player && document.getElementById('youtube-player-section')) {
          initYouTubePlayer();
          clearInterval(checkYT);
        }
      }, 500);

      return () => clearInterval(checkYT);
    }
  }, [homeVideoEnabled, homeVideoUrl, youtubeId]);

  function initYouTubePlayer() {
    if (youtubePlayerRef.current) return;
    
    youtubePlayerRef.current = new (window as any).YT.Player('youtube-player-section', {
      events: {
        onReady: (event: any) => {
          console.log('YouTube Player Ready');
          event.target.mute();
          event.target.setVolume(100);
        },
        onStateChange: (event: any) => {
          // Ensure it keeps playing if it gets paused by the browser
          if (event.data === (window as any).YT.PlayerState.PAUSED) {
            event.target.playVideo();
          }
        }
      }
    });
  }

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    
    const yt = youtubePlayerRef.current;
    if (yt && typeof yt.unMute === 'function') {
      console.log('Toggling YT sound:', !newMuted);
      if (newMuted) {
        yt.mute();
      } else {
        yt.unMute();
        yt.setVolume(100);
        // Sometimes YT needs a second play command after unmuting to wake up the audio context
        if (typeof yt.playVideo === 'function') yt.playVideo();
      }
    }

    if (videoRef.current) {
      videoRef.current.muted = newMuted;
      if (!newMuted) {
        videoRef.current.volume = 1;
        videoRef.current.play().catch(() => {}); // Ensure playing
      }
    }
  };

  if (!homeVideoEnabled || !homeVideoUrl) return null;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <div className="relative h-full w-full">
          {youtubeId ? (
            <div className="absolute inset-0 h-full w-full pointer-events-none scale-[1.35]">
               <iframe
                id="youtube-player-section"
                src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=1&mute=0&controls=0&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&disablekb=1&playlist=${youtubeId}&loop=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
                className="absolute inset-0 h-full w-full pointer-events-none"
                allow="autoplay; encrypted-media"
                tabIndex={-1}
                frameBorder="0"
              />
            </div>
          ) : (
            <video
              ref={videoRef}
              src={resolveImageUrl(homeVideoUrl)}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          )}
          
          {/* Dark Overlay to make text readable and hide some YT elements */}
          <div className="absolute inset-0 bg-black/40 z-10" />
        </div>
      </div>

      {/* Floating Controls */}
      <div className="absolute bottom-10 right-10 z-20">
        <motion.button
          initial={false}
          animate={{ scale: isMuted ? [1, 1.05, 1] : 1 }}
          transition={{ repeat: isMuted ? Infinity : 0, duration: 2 }}
          onClick={toggleMute}
          className="flex items-center gap-3 rounded-full bg-black/60 px-6 py-4 text-white backdrop-blur-xl transition-all hover:bg-black/80 active:scale-95 border border-white/20 shadow-2xl group"
        >
          {isMuted ? (
            <>
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 0.5, repeatDelay: 1.5 }}
              >
                <FiVolumeX className="text-2xl text-(--ui-primary)" />
              </motion.div>
              <span className="text-sm font-bold uppercase tracking-wider">Unmute for Sound</span>
            </>
          ) : (
            <>
              <FiVolume2 className="text-2xl" />
              <span className="text-sm font-bold uppercase tracking-wider">Mute Sound</span>
            </>
          )}
        </motion.button>
      </div>
    </section>
  );
}
