import {
  Button,
  Center,
  Container,
  Flex,
  SegmentedControl,
  TextInput,
  Title,
  Select,
  Switch,
  Textarea,
  ColorInput,
  FileInput,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import React, { useState } from 'react';

import { notifications } from '@mantine/notifications';

interface CreatePromiseProps {
  onViewChange: (value: 'create' | 'scan') => void;
}

const CreatePromise = ({ onViewChange }: CreatePromiseProps) => {
  const [loading, setLoading] = useState(false);

  const vowTemplates = [
    { label: 'I solemnly swear to...', value: 'solemn' },
    { label: 'I promise, with all my heart, that...', value: 'heart' },
    { label: 'No backing out, I will definitely...', value: 'noBackingOut' },
    { label: 'Custom vow', value: 'custom' },
  ];

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      promiseTo: '',
      expiryDate: null,
      isRecurring: false,
      recurringPeriod: '',
      vowTemplate: '',
      vow: '',
      proofImage: '',
      proofComment: '',
      recipientEmail: '',
      theme: '',
      voiceRecording: '',
      isSecret: false,
      revealDate: null,
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
      const formData = new FormData();

      // Add file uploads if present
      if (values.proofImage) {
        formData.append('proofImage', values.proofImage);
      }
      if (values.voiceRecording) {
        formData.append('voiceRecording', values.voiceRecording);
      }

      // Add other form values
      formData.append(
        'data',
        JSON.stringify({
          ...values,
          proofImage: undefined,
          voiceRecording: undefined,
        })
      );

      const response = await fetch('/api/promises/create', {
        method: 'POST',
        body: formData,
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

            <TextInput
              label="Recipient Email"
              placeholder="Enter recipient's email for notifications"
              description="We'll send reminders and updates to this email"
              {...form.getInputProps('recipientEmail')}
            />

            <DateTimePicker
              label="Expiry Date"
              placeholder="When should this promise be fulfilled?"
              description="Set a deadline for your promise"
              {...form.getInputProps('expiryDate')}
            />

            <Switch
              label="Recurring Promise"
              description="Does this promise repeat?"
              {...form.getInputProps('isRecurring', { type: 'checkbox' })}
            />

            {form.values.isRecurring && (
              <Select
                label="Recurring Period"
                placeholder="Select how often this promise repeats"
                data={[
                  { label: 'Weekly', value: 'WEEKLY' },
                  { label: 'Monthly', value: 'MONTHLY' },
                ]}
                {...form.getInputProps('recurringPeriod')}
              />
            )}

            <Select
              label="Vow Template"
              placeholder="Choose a vow template or create your own"
              data={vowTemplates}
              {...form.getInputProps('vowTemplate')}
            />

            {form.values.vowTemplate === 'custom' && (
              <Textarea
                label="Custom Vow"
                placeholder="Write your own vow..."
                description="Make it personal and meaningful"
                {...form.getInputProps('vow')}
              />
            )}

            <ColorInput
              label="Theme Color"
              placeholder="Choose a color for your promise card"
              description="Personalize your promise card"
              {...form.getInputProps('theme')}
            />

            <Switch
              label="Secret Promise"
              description="Hide this promise until a specific date"
              {...form.getInputProps('isSecret', { type: 'checkbox' })}
            />

            {form.values.isSecret && (
              <DateTimePicker
                label="Reveal Date"
                placeholder="When should this promise be revealed?"
                description="The promise will be hidden until this date"
                {...form.getInputProps('revealDate')}
              />
            )}

            <FileInput
              label="Proof Image"
              placeholder="Upload an image as proof"
              description="Optional: Add a photo to prove promise completion"
              accept="image/*"
              {...form.getInputProps('proofImage')}
            />

            <FileInput
              label="Voice Recording"
              placeholder="Add a voice message"
              description="Optional: Record your promise"
              accept="audio/*"
              {...form.getInputProps('voiceRecording')}
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
