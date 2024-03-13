import { Avatar, Flex, Indicator } from "@mantine/core";

const Root = () => {
  return (
    <Flex direction={"column"} p={"md"}>
      <Indicator color="lime">
        <Avatar
          size="lg"
          radius="sm"
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png"
        />
      </Indicator>
      <div>asgasgaewg</div>
    </Flex>
  );
};

export default Root;
