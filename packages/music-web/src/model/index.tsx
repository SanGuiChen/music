import { MUSIC_TOKEN } from '@/constants';
import { useEffect } from 'react';

export const useLogin = () => {
  useEffect(() => {
    const token = localStorage.getItem(MUSIC_TOKEN);
    if (token) {
    }
  }, []);
};
