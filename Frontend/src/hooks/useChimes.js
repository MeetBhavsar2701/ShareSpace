// src/hooks/useChimes.js

import useSound from 'use-sound';

// ENHANCEMENT: Using local sound files from the 'public' folder
const tapSfx = '/sounds/tap.mp3'; 
const successSfx = '/sounds/success.mp3';
const errorSfx = '/sounds/error.mp3';

export const useChimes = () => {
  const [playTap] = useSound(tapSfx, { volume: 0.5 });
  const [playSuccess] = useSound(successSfx, { volume: 0.7 });
  const [playError] = useSound(errorSfx, { volume: 0.6 });

  return {
    tap: playTap,
    success: playSuccess,
    error: playError,
  };
};