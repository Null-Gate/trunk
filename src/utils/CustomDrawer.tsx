// CustomDrawer.tsx
import React from "react";
import { Drawer } from "@mantine/core";

interface CustomDrawerProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({
  opened,
  onClose,
  title,
  children,
}) => {
  return (
    <Drawer
      opened={opened}
      size={"75%"}
      position="bottom"
      onClose={onClose}
      title={title}
      padding="xl"
      overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
    >
      {children}
    </Drawer>
  );
};

export default CustomDrawer;
