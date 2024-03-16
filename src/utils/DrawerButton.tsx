// DrawerButton.tsx
import { Button } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import React from "react";

interface DrawerButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  icon: React.ReactNode;
}

const DrawerButton: React.FC<DrawerButtonProps> = ({
  children,
  onClick,
  icon,
}) => {
  return (
    <Button
      leftSection={icon}
      rightSection={<IconArrowRight size={14} />}
      variant="light"
      color="lime"
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default DrawerButton;
