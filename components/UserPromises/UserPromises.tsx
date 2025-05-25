import { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  Text,
  Badge,
  Group,
  Stack,
  Title,
  LoadingOverlay,
  Button,
  Modal,
  Select,
  TextInput,
  Image,
  ActionIcon,
  Menu,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconDotsVertical,
  IconQrcode,
  IconTrash,
  IconFilter,
  IconExternalLink,
} from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { format } from 'date-fns';

interface PromiseData {
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
  const [promises, setPromises] = useState<PromiseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPromise, setSelectedPromise] = useState<PromiseData | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [qrModalOpened, { open: openQrModal, close: closeQrModal }] = useDisclosure(false);
  const [forfeitModalOpened, { open: openForfeitModal, close: closeForfeitModal }] =
    useDisclosure(false);
  const [promiseToForfeit, setPromiseToForfeit] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const fetchQRCode = async (promiseId: string) => {
    try {
      console.log('Fetching QR code for promise:', promiseId);
      const response = await fetch(`/api/promises/qr/${promiseId}`);
      console.log('QR code response:', response.status);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch QR code');
      }

      const data = await response.json();
      console.log('QR code data:', data);

      if (!data.qrCode) {
        throw new Error('Invalid QR code data received');
      }

      setQrCode(data.qrCode);
      setSelectedPromise(promises.find((p) => p.id === promiseId) || null);
      openQrModal();
    } catch (error) {
      console.error('QR code error:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to generate QR code',
        color: 'red',
      });
    }
  };

  const handleForfeitClick = (promiseId: string) => {
    setPromiseToForfeit(promiseId);
    openForfeitModal();
  };

  const handleForfeit = async () => {
    if (!promiseToForfeit) return;

    try {
      console.log('Forfeiting promise:', promiseToForfeit);
      const response = await fetch(`/api/promises/forfeit/${promiseToForfeit}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to forfeit promise');
      }

      setPromises(
        promises.map((p) => (p.id === promiseToForfeit ? { ...p, status: 'CANCELLED' } : p))
      );

      notifications.show({
        title: 'Success',
        message: 'Promise forfeited',
        color: 'blue',
      });
      closeForfeitModal();
    } catch (error) {
      console.error('Forfeit error:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to forfeit promise',
        color: 'red',
      });
    }
  };

  useEffect(() => {
    const fetchPromises = async () => {
      try {
        const response = await fetch('/api/promises/list');
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to fetch promises');
        }
        const data = await response.json();
        setPromises(data);
      } catch (error) {
        console.error('Error fetching promises:', error);
        notifications.show({
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to fetch promises',
          color: 'red',
        });
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

  const filteredPromises = promises.filter((promise) => {
    const matchesStatus = !statusFilter || promise.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      promise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promise.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promise.promiseTo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <Stack maw={1200} mx="auto">
      <Group justify="space-between" align="center">
        <Title order={2}>Your Promises</Title>
        <Group>
          <TextInput
            placeholder="Search promises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            leftSection={<IconFilter size={16} />}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
            clearable
            data={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'FULFILLED', label: 'Fulfilled' },
              { value: 'CANCELLED', label: 'Cancelled' },
            ]}
          />
        </Group>
      </Group>

      <div style={{ position: 'relative', minHeight: loading ? '200px' : 'auto' }}>
        <LoadingOverlay visible={loading} />
        <Grid>
          {filteredPromises.map((promise) => (
            <Grid.Col key={promise.id} span={{ base: 12, sm: 6, lg: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder pos="relative">
                <Menu position="bottom-end" withinPortal>
                  <Menu.Target>
                    <ActionIcon variant="subtle" pos="absolute" top={8} right={8}>
                      <IconDotsVertical size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<IconExternalLink size={16} />}
                      onClick={() => router.push(`/promise/${promise.id}`)}
                    >
                      Open Promise
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconQrcode size={16} />}
                      onClick={() => fetchQRCode(promise.id)}
                    >
                      Show QR Code
                    </Menu.Item>
                    {promise.status === 'ACTIVE' && (
                      <Menu.Item
                        color="red"
                        leftSection={<IconTrash size={16} />}
                        onClick={() => handleForfeitClick(promise.id)}
                      >
                        Forfeit Promise
                      </Menu.Item>
                    )}
                  </Menu.Dropdown>
                </Menu>
                <Stack gap="md">
                  <Group justify="space-between" align="flex-start">
                    <Stack gap={4}>
                      <Text fw={500} size="lg" style={{ paddingRight: '2rem' }}>
                        {promise.title}
                      </Text>
                      <Badge color={getStatusColor(promise.status)}>{promise.status}</Badge>
                    </Stack>
                  </Group>
                  <Text size="sm" c="dimmed" lineClamp={2}>
                    {promise.description}
                  </Text>
                  <Stack gap="xs">
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
                  </Stack>

                  <Group gap="md">
                    <Tooltip label="Reactions">
                      <Badge variant="light">{promise.reactions.length} Reactions</Badge>
                    </Tooltip>
                    <Tooltip label="Challenges">
                      <Badge variant="light">{promise.challenges.length} Challenges</Badge>
                    </Tooltip>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </div>

      {!loading && filteredPromises.length === 0 && (
        <Card withBorder p="xl" ta="center">
          <Stack align="center" gap="md">
            <Text size="lg" fw={500}>
              No promises found
            </Text>
            <Text size="sm" c="dimmed">
              {promises.length === 0
                ? "You haven't made any promises yet"
                : 'No promises match your current filters'}
            </Text>
          </Stack>
        </Card>
      )}

      <Modal opened={qrModalOpened} onClose={closeQrModal} title={selectedPromise?.title} centered>
        <Stack>
          {qrCode && (
            <Image
              src={qrCode}
              alt="Promise QR Code"
              style={{ maxWidth: '300px', margin: '0 auto' }}
            />
          )}
          <Text size="sm" c="dimmed" ta="center">
            This QR code can be used to quickly access and verify your promise.
          </Text>
          <Button onClick={closeQrModal} fullWidth>
            Close
          </Button>
        </Stack>
      </Modal>

      <Modal
        opened={forfeitModalOpened}
        onClose={closeForfeitModal}
        title="Forfeit Promise"
        centered
      >
        <Stack>
          <Text>Are you sure you want to forfeit this promise? This action cannot be undone.</Text>
          <Group justify="flex-end">
            <Button variant="light" onClick={closeForfeitModal}>
              Cancel
            </Button>
            <Button color="red" onClick={handleForfeit}>
              Forfeit Promise
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
