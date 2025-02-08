import { useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/tauri';

import { AppTimeInfo } from '../lib/types';

export function useScreenTime() {
  const [appTimes, setAppTimes] = useState<AppTimeInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await invoke<AppTimeInfo[]>('get_app_times');
        setAppTimes(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setIsLoading(false);
      }
    };

    const setupListener = async () => {
      const unlisten = await listen<AppTimeInfo[]>('screen-time-update', (event) => {
        setAppTimes(event.payload);
      });

      return unlisten;
    };

    fetchInitialData();
    const unlistenPromise = setupListener();

    return () => {
      unlistenPromise.then(unlisten => unlisten());
    };
  }, []);

  return { appTimes, isLoading };
}