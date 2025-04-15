import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';

export function useAuthGuardForUI() {
  const { user, loadingUser } = useUser();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loadingUser) {
      setChecking(false);
    }
  }, [loadingUser]);

  return { user, loadingUser, checking };
}
