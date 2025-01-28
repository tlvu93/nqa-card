import { Button, Center, Container, Flex, SegmentedControl, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import React from 'react';

interface ScanPromiseProps {
  onViewChange: (value: 'create' | 'scan') => void;
}

const ScanPromise = ({ onViewChange }: ScanPromiseProps) => {
  const form = useForm({
    initialValues: {
      promiseTo: '',
      label1: '',
      label2: '',
    },
    validate: {
      promiseTo: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
      label1: (value) => (value.length < 2 ? 'Label must be at least 2 characters' : null),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    console.log(values);
    // Handle form submission
  });

  return (
    <Container size="xs" mt="xl">
      <Flex direction="column" gap="lg">
        <Center>
          <SegmentedControl
            value="scan"
            onChange={(value) => onViewChange(value as 'create' | 'scan')}
            data={[
              { label: 'Create Promise', value: 'create' },
              { label: 'Scan Promise', value: 'scan' },
            ]}
          />
        </Center>

        <Title order={1} ta="center">
          Scan Promise
        </Title>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="md">
            <TextInput
              required
              label="Promise to"
              placeholder="Enter the name of the promise receiver"
              description="This is a description"
              {...form.getInputProps('promiseTo')}
            />

            <TextInput
              required
              label="Label"
              placeholder="Placeholder text"
              description="This is a description"
              {...form.getInputProps('label1')}
            />

            <TextInput
              label="Label"
              placeholder="Placeholder text"
              description="This is a description"
              {...form.getInputProps('label2')}
            />

            <Button type="submit" fullWidth>
              Scan Promise
            </Button>
          </Flex>
        </form>
      </Flex>
    </Container>
  );
};

export default ScanPromise;
