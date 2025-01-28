import { useEffect, useState } from 'react';
import { Grid, Card, Text, Badge, Group, Stack, Title, LoadingOverlay } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';

interface Promise {
  id: string;
  title: string;
  description: string;
  promiseTo: string;
  status: string;
  createdAt: string;
  expiryDate: string | null;
  reactions: any[];
  challenges: any[];
}

export function UserPromises() {
  const [promises, setPromises] = useState<Promise[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPromises = async () => {
      try {
        const response = await fetch('/api/promises/list');
        if (!response.ok) {
          throw new Error('Failed to fetch promises');
        }
        const data = await response.json();
        setPromises(data);
      } catch (error) {
        console.error('Error fetching promises:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchPromises();
    }
  }, [session]);

  if (!session) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FULFILLED':
        return 'green';
      case 'CANCELLED':
        return 'red';
      default:
        return 'blue';
    }
  };

  return (
    <Stack maw={1200} mx="auto">
      <Title order={2}>Your Promises</Title>
      <div style={{ position: 'relative', minHeight: loading ? '200px' : 'auto' }}>
        <LoadingOverlay visible={loading} />
        <Grid>
          {promises.map((promise) => (
            <Grid.Col key={promise.id} span={{ base: 12, sm: 6, lg: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack>
                  <Group justify="space-between">
                    <Text fw={500} size="lg">
                      {promise.title}
                    </Text>
                    <Badge color={getStatusColor(promise.status)}>{promise.status}</Badge>
                  </Group>
                  <Text size="sm" color="dimmed">
                    {promise.description}
                  </Text>
                  <Group gap="xs">
                    <Text size="sm" fw={500}>
                      Promised to:
                    </Text>
                    <Text size="sm">{promise.promiseTo}</Text>
                  </Group>
                  <Group gap="xs">
                    <Text size="sm" fw={500}>
                      Created:
                    </Text>
                    <Text size="sm">{format(new Date(promise.createdAt), 'MMM d, yyyy')}</Text>
                  </Group>
                  {promise.expiryDate && (
                    <Group gap="xs">
                      <Text size="sm" fw={500}>
                        Expires:
                      </Text>
                      <Text size="sm">{format(new Date(promise.expiryDate), 'MMM d, yyyy')}</Text>
                    </Group>
                  )}
                  <Group gap="xs">
                    <Text size="sm" fw={500}>
                      Reactions:
                    </Text>
                    <Text size="sm">{promise.reactions.length}</Text>
                  </Group>
                  <Group gap="xs">
                    <Text size="sm" fw={500}>
                      Challenges:
                    </Text>
                    <Text size="sm">{promise.challenges.length}</Text>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </div>
    </Stack>
  );
}
