"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { Howl } from "howler";

type SoundName = "tardis" | "sonic" | "hum" | "cloister";

const SOUND_FILES: Record<SoundName, string> = {
  tardis: "/sounds/tardis.mp3",
  sonic: "/sounds/sonic.mp3",
  hum: "/sounds/hum.mp3",
  cloister: "/sounds/cloister.mp3",
};

export function useSound() {
  const [enabled, setEnabled] = useState(false);
  const soundsRef = useRef<Record<string, Howl>>({});

  useEffect(() => {
    const stored = localStorage.getItem("doctorbot-sound");
    if (stored === "true") setEnabled(true);
  }, []);

  // Cleanup Howl instances on unmount to free audio resources
  useEffect(() => {
    return () => {
      Object.values(soundsRef.current).forEach((howl) => howl.unload());
      soundsRef.current = {};
    };
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("doctorbot-sound", String(next));
      return next;
    });
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (!enabled) return;
      if (!soundsRef.current[name]) {
        soundsRef.current[name] = new Howl({
          src: [SOUND_FILES[name]],
          volume: 0.3,
          preload: true,
        });
      }
      soundsRef.current[name].play();
    },
    [enabled]
  );

  const stop = useCallback((name: SoundName) => {
    soundsRef.current[name]?.stop();
  }, []);

  return { enabled, toggle, play, stop };
}
