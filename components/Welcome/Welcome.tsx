import { Title, Text, Container } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  return (
    <Container>
      <Title className={classes.title} ta="center">
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'blue', to: 'violet' }}>
          No Question Asked
        </Text>
      </Title>
      <Text color="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        &ldquo;Hey there! Welcome to &lsquo;No Question Asked&lsquo;—where sealing an unbreakable
        promise with your friends is just a few clicks away. Ever want to ensure a buddy commits to
        task without asking any questions? Create a voucher that makes it official.&rdquo;
      </Text>
    </Container>
  );
}
