import { Flex } from "@mantine/core";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Flex direction="column">
      {children}
    </Flex>
  );
};

export default Layout;
