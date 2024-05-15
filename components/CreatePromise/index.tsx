import { Center, Container, Flex, Text, Title } from '@mantine/core';
import React from 'react';

const CreatePromise = () => (
  <Container mt="xl">
    <Center>
      <Flex direction="column" align="center">
        <Title order={1}>Create Voucher</Title>
        <Text mt="sm" c="dimmed">
          Create a promise that makes it official
        </Text>
      </Flex>
    </Center>
  </Container>
);

export default CreatePromise;
