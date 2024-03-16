import { Flex } from "@mantine/core";
import { ReactNode } from "react";
import Nav from "./Nav";
import { useLocation } from "react-router-dom";
import IntroAnimation from "../components/IntroAnimation/IntroAnimation";
import BottomMenu from "./BottomMenu";
import { Notifications } from "@mantine/notifications";


interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  // console.log(pathname);

 

  return (
    <Flex direction="column" justify={"space-around"}>
      <Notifications position="top-right" zIndex={1000} />

      {pathname === "/profile" ? null : pathname === "/sign-up" ||
        pathname === "/login" ? (
        <IntroAnimation />
      ) : (
        <Nav />
      )}
      <div className=" overflow-y-scroll">{children}</div>
      {pathname === "/sign-up" || pathname === "/login" ? null : <BottomMenu />}
    </Flex>
  );
};

export default Layout;
