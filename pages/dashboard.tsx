import { Container, Paper, Stack } from '@mantine/core';
import PromiseManager from '@/components/PromiseManager/PromiseManager';
import AuthGuard from '@/components/AuthGuard/AuthGuard';
import { BaseLayout } from '@/layouts/BaseLayout';
import { UserPromises } from '@/components/UserPromises/UserPromises';

function DashboardView() {
  return (
    <Container size="xl">
      <Stack gap="xl">
        <Paper shadow="xs" p="xl">
          <PromiseManager />
        </Paper>
        <UserPromises />
      </Stack>
    </Container>
  );
}

DashboardView.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <BaseLayout>
      <AuthGuard>{page}</AuthGuard>
    </BaseLayout>
  );
};

export default DashboardView;
