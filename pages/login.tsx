import { useEffect } from 'react';
import { Center, Grid, em, Button } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Welcome } from '../components/Welcome/Welcome';

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const isMobile = useMediaQuery(`(max-width: ${em(1024)})`);

  const centerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: em(32),
    overflow: 'hidden',
  };

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>; // Show a loading state while the session is being fetched
  }

  return (
    <div style={centerStyle}>
      <Grid h="100%">
        <Grid.Col hidden={isMobile} span={6} h="100%">
          <Welcome />
        </Grid.Col>

        <Grid.Col span={isMobile ? 12 : 6}>
          <Center h="100%">
            <div>
              <Button onClick={() => signIn('google')}>Sign in with Google</Button>
              <Button onClick={() => signIn('github')}>Sign in with GitHub</Button>
            </div>
          </Center>
        </Grid.Col>
      </Grid>
    </div>
  );
}
