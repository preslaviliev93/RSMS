import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';

export function useRedirectIfAuthenticated() {
  const { user, loadingUser } = useUser();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loadingUser) {
      if (user) {
        router.replace('/servers'); // use replace instead of push to avoid flicker in history
      } else {
        setChecking(false);
      }
    }
  }, [user, loadingUser, router]);

  return { user, loadingUser, checking };
}
