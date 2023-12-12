import { useCallback, useState } from 'react';
import { storageAvailable } from './utils';

const KEY = '__bl-profile-demo';

const initProfile = localStorage.getItem(KEY);
const localStorageAvailable = storageAvailable('localStorage');

export default function useProfileStorage() {
  const [profile, setProfile] = useState(initProfile ? JSON.parse(initProfile) : null);

  const save = useCallback((p) => {
    if (storageAvailable('localStorage')) {
      localStorage.setItem(KEY, JSON.stringify(p));
    }
    setProfile(p);
  }, []);

  return {
    available: localStorageAvailable,
    profile,
    save,
    isNewProfile: profile === null,
  };
}
