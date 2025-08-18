import { useState, useEffect } from "preact/hooks";

// This is a browser-only feature, so we check if window is defined.
const isBrowser = typeof window !== "undefined";
const audioContext = isBrowser ? new (window.AudioContext || window.webkitAudioContext)() : null;

function playChime(frequency, duration, type = 'sine') {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

  // CORRECTED: Use 'audioContext' instead of 'audio_context'
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);

  // CORRECTED: Use 'audioContext' instead of 'audio_context'
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

export const useChimes = () => {
  const [chime, setChime] = useState(null);

  useEffect(() => {
    setChime({
      success: () => playChime(880.0, 0.3, 'triangle'),
      error: () => playChime(220.0, 0.2, 'square'),
    });
  }, []);

  return chime;
};