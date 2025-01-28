import { Container, Button, Stack, Group } from '@mantine/core';
import { useRouter } from 'next/router';
import { Welcome } from '@/components/Welcome/Welcome';
import { BaseLayout } from '@/layouts/BaseLayout';

function HomePageView() {
  const router = useRouter();

  return (
    <Container size="xl">
      <Stack gap="xl">
        <Welcome />
        <Group justify="center" gap="xl">
          <Button
            size="lg"
            variant="gradient"
            gradient={{ from: 'blue', to: 'violet' }}
            onClick={() => router.push('/login')}
          >
            Login
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.push('/dashboard')}>
            Continue without Login
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}

HomePageView.getLayout = function getLayout(page: React.ReactNode) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default HomePageView;
