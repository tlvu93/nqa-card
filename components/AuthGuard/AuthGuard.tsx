import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const { status } = useSession();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      setIsRedirecting(true);
      router.push(process.env.NEXT_PUBLIC_LOGIN_URL || '/login');
    }
  }, [status, router]);

  if (status === 'loading' || isRedirecting) {
    return <div></div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
