import React from "react";
import { Card, Image, Text, Badge, Button, Group } from "@mantine/core";

// Define props interface
interface AdventureCardProps {
  title: string;
  description: string;
  image_url: string;
  linkUrl: string;
  is_avaiable: boolean;
}

const AdventureCard: React.FC<AdventureCardProps> = ({
  title,
  description,
  image_url,
  linkUrl,
  is_avaiable,
}) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section component="a" href={linkUrl}>
        <Image src={image_url} height={100} alt={title} />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text w={500}>{title}</Text>
        <Badge color={`${is_avaiable ? "lime" : "red"}`}>
          {is_avaiable ? "avaiable" : "not avaiable"}
        </Badge>
      </Group>

      <Text size="sm" color="dimmed">
        {description}
      </Text>

      <Button
        color={`${is_avaiable ? "lime" : "red"}`}
        fullWidth
        mt="md"
        radius="md"
        disabled={!is_avaiable}
      >
        Book Now
      </Button>
    </Card>
  );
};

export default AdventureCard;
