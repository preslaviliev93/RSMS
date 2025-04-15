import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';

export function useAuthGuard() {
  const { user, loadingUser } = useUser();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loadingUser) {
      if (!user) {
        router.replace('/login');
      } else {
        setChecking(false);
      }
    }
  }, [user, loadingUser, router]);

  return { user, loadingUser, checking };
}
