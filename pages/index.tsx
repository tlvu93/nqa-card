import { Container, Paper, Tabs, rem } from '@mantine/core';
import { IconCards, IconQrcode } from '@tabler/icons-react';
import CreatePromise from '@/components/CreatePromise/CreatePromise';
import AuthGuard from '@/components/AuthGuard/AuthGuard';
import { BaseLayout } from '@/layouts/BaseLayout';

function HomePageView() {
  const iconStyle = { width: rem(12), height: rem(12) };
  return (
    <Container>
      <Paper shadow="xs" p="xl">
        <Tabs pt="xl" defaultValue="create-promise">
          <Tabs.List grow>
            <Tabs.Tab value="create-promise" leftSection={<IconCards style={iconStyle} />}>
              Create promise
            </Tabs.Tab>
            <Tabs.Tab value="scan-promise" leftSection={<IconQrcode style={iconStyle} />}>
              Scan promise
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="create-promise">
            <CreatePromise />
          </Tabs.Panel>

          <Tabs.Panel value="scan-promise">scan-promise tab content</Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
}

HomePageView.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <BaseLayout>
      <AuthGuard>{page}</AuthGuard>
    </BaseLayout>
  );
};

export default HomePageView;
