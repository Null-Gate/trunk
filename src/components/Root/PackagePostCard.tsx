import React from "react";
import { Card, Image, Text, Badge, Button, Group } from "@mantine/core";
import { NewFeedItem } from "./types"; // Assuming you have a types file

interface PackageCardProps {
  item: NewFeedItem;
}

export const PackageCard: React.FC<PackageCardProps> = ({ item }) => (
  <Card shadow="sm" padding="lg" radius="md" withBorder>
    <Card.Section>
      <Image
        src={
          "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
        }
        height={160}
        alt="Package Image"
      />
    </Card.Section>

    <Group justify="space-between" mt="md" mb="xs">
      <Text c="gray.7" fw={700}>
        {item?.username?.String}
      </Text>
      <Badge color="lime" variant="light">
        {item.from_where} to {item.to_where}
      </Badge>
    </Group>

    <Text size="sm" c="dimmed">
      Expire : {item.formattedDate || item.exp_date_to_send}
    </Text>
    <Text size="sm" c="dimmed">
      Package Name : {item.package_name}
    </Text>
    <Text size="sm" c="dimmed">
      Package Details : {item.pkg_details}
    </Text>

    <Button color="lime" fullWidth mt="md" radius="md">
      Contact Now
    </Button>
  </Card>
);
