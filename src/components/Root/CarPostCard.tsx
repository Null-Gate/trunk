import React from 'react';
import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';
import { NewFeedItem } from './types';

interface CarPostCardProps {
  item: NewFeedItem;
}

export const CarPostCard: React.FC<CarPostCardProps> = ({ item }) => (
  <Card shadow="sm" padding="lg" radius="md" withBorder>
    <Card.Section>
      <Image src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png" height={160} alt="Norway" />
    </Card.Section>

    <Group justify="space-between" mt="md" mb="xs">
      <Text c="lime" fw={700}>
        {item.userinfo.id.String}
      </Text>
      <Badge color="lime" variant="light">
        {item.from_where} to {item.to_where}
      </Badge>
    </Group>

    <Text size="sm" color="dimmed">
      Date: {item.formattedDate}
    </Text>

    <Button color="lime" fullWidth mt="md" radius="md">
      Book Now
    </Button>
  </Card>
);
