import { Button, Center, Container, Flex, SegmentedControl, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useState } from 'react';

import { notifications } from '@mantine/notifications';

interface CreatePromiseProps {
  onViewChange: (value: 'create' | 'scan') => void;
}

const CreatePromise = ({ onViewChange }: CreatePromiseProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      promiseTo: '',
    },
    validate: {
      title: (value) => (value.length < 2 ? 'Title must be at least 2 characters' : null),
      description: (value) =>
        value.length < 2 ? 'Description must be at least 2 characters' : null,
      promiseTo: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setLoading(true);
    try {
      const response = await fetch('/api/promises/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create promise');
      }

      await response.json();
      notifications.show({
        title: 'Success',
        message: 'Promise created successfully',
        color: 'green',
      });
      form.reset();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create promise',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  });

  return (
    <Container size="xs" mt="xl">
      <Flex direction="column" gap="lg">
        <Center>
          <SegmentedControl
            value="create"
            onChange={(value) => onViewChange(value as 'create' | 'scan')}
            data={[
              { label: 'Create Promise', value: 'create' },
              { label: 'Scan Promise', value: 'scan' },
            ]}
          />
        </Center>

        <Title order={1} ta="center">
          Create Promise
        </Title>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="md">
            <TextInput
              required
              label="Title"
              placeholder="Enter a title for your promise"
              description="A short title describing what you're promising"
              {...form.getInputProps('title')}
            />

            <TextInput
              required
              label="Description"
              placeholder="Enter the details of your promise"
              description="Describe what you're promising in detail"
              {...form.getInputProps('description')}
            />

            <TextInput
              required
              label="Promise to"
              placeholder="Enter the name of the promise receiver"
              description="Who are you making this promise to?"
              {...form.getInputProps('promiseTo')}
            />

            <Button type="submit" fullWidth loading={loading}>
              Create Promise
            </Button>
          </Flex>
        </form>
      </Flex>
    </Container>
  );
};

export default CreatePromise;
