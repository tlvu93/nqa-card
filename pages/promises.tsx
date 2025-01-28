import { Container, Stack } from '@mantine/core';
import { UserPromises } from '@/components/UserPromises/UserPromises';
import AuthGuard from '@/components/AuthGuard/AuthGuard';
import { BaseLayout } from '@/layouts/BaseLayout';

function PromisesPage() {
  return (
    <Container size="xl">
      <Stack gap="xl">
        <UserPromises />
      </Stack>
    </Container>
  );
}

PromisesPage.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <BaseLayout>
      <AuthGuard>{page}</AuthGuard>
    </BaseLayout>
  );
};

export default PromisesPage;
