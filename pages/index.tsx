import { Container, Paper } from '@mantine/core';
import PromiseManager from '@/components/PromiseManager/PromiseManager';
import AuthGuard from '@/components/AuthGuard/AuthGuard';
import { BaseLayout } from '@/layouts/BaseLayout';

function HomePageView() {
  return (
    <Container>
      <Paper shadow="xs" p="xl">
        <PromiseManager />
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
