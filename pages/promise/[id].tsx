import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Container, Paper, Title, Text, Stack, Loader, Center } from '@mantine/core';
import { BaseLayout } from '@/layouts/BaseLayout';

interface Promise {
  id: string;
  title: string;
  description: string;
  promiseTo: string;
  expiryDate: string | null;
  isRecurring: boolean;
  recurringPeriod: string | null;
  vow: string;
  theme: string;
  isSecret: boolean;
  revealDate: string | null;
  createdAt: string;
}

function PromiseView() {
  const router = useRouter();
  const { id } = router.query;
  const [promise, setPromise] = useState<Promise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPromise = async () => {
      try {
        const response = await fetch(`/api/promises/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch promise');
        }
        const data = await response.json();
        setPromise(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load promise');
      } finally {
        setLoading(false);
      }
    };

    fetchPromise();
  }, [id]);

  if (loading) {
    return (
      <Center h={400}>
        <Loader size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Container size="sm">
        <Paper p="xl" withBorder>
          <Text c="red" ta="center" size="lg">
            {error}
          </Text>
        </Paper>
      </Container>
    );
  }

  if (!promise) {
    return (
      <Container size="sm">
        <Paper p="xl" withBorder>
          <Text ta="center" size="lg">
            Promise not found
          </Text>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="sm">
      <Paper p="xl" withBorder>
        <Stack gap="md">
          <Title order={2}>{promise.title}</Title>
          <Text size="lg" fw={500}>
            Promised to: {promise.promiseTo}
          </Text>
          <Text>{promise.description}</Text>
          {promise.vow && (
            <Paper p="md" bg="gray.1">
              <Text fs="italic">&ldquo;{promise.vow}&rdquo;</Text>
            </Paper>
          )}
          {promise.expiryDate && (
            <Text size="sm" c="dimmed">
              Due by: {new Date(promise.expiryDate).toLocaleDateString()}
            </Text>
          )}
          {promise.isRecurring && (
            <Text size="sm" c="dimmed">
              Recurring: {promise.recurringPeriod?.toLowerCase()}
            </Text>
          )}
          <Text size="sm" c="dimmed">
            Created: {new Date(promise.createdAt).toLocaleDateString()}
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
}

PromiseView.getLayout = function getLayout(page: React.ReactNode) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default PromiseView;
