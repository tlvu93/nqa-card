import { Center, Grid, em } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Welcome } from '../components/Welcome/Welcome';

import { AuthenticationForm } from '@/components/AuthenticationForm';

export default function HomePage() {
  const isMobile = useMediaQuery(`(max-width: ${em(1024)})`);

  const centerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: em(32),
    overflow: 'hidden',
  };

  return (
    <div style={centerStyle}>
      <Grid h="100%">
        <Grid.Col hidden={isMobile} span={6} h="100%">
          <Welcome />
        </Grid.Col>

        <Grid.Col span={isMobile ? 12 : 6}>
          <Center h="100%">
            <AuthenticationForm />
          </Center>
        </Grid.Col>
      </Grid>
    </div>
  );
}
