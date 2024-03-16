import React from "react";
import { useMutation } from "react-query";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Button,
  Group,
  Box,
  Flex,
  PasswordInput,
  Alert,
  Text,
} from "@mantine/core";
import { IoIosWarning } from "react-icons/io";
import { loginUser } from "../service/api";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
  });
  const nav = useNavigate();

  const {
    mutate: login,
    isLoading,
    isError,
    error,
  } = useMutation(loginUser, {
    onSuccess: (data) => {
      console.log("Login successful:", data);
      Cookies.set("token", data?.token);
      Cookies.set("name", data?.user_details.username);
      if (data?.token) {
        nav("/");
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    login(form.values);
  };

  return (
    <Flex
      gap={15}
      direction={"column"}
      h={"50vh"}
      justify={"center"}
      align={"center"}
    >
      <Box style={{ width: "100vw", maxWidth: 340 }} mx="auto">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Username"
            placeholder="Enter your name"
            {...form.getInputProps("username")}
          />
          <PasswordInput
            label="Password"
            mt={"md"}
            placeholder="Enter your password"
            {...form.getInputProps("password")}
          />
          <Group justify="center" mt="xl">
            <Button
              color={"lime"}
              type="submit"
              w={"100%"}
              disabled={isLoading}
            >
              Login
            </Button>
          </Group>
          {isError && (
            <div>
              Error logging in:
              {error instanceof Error
                ? error.message
                : "An unknown error occurred"}
            </div>
          )}
        </form>
      </Box>
      <Alert
        variant="light"
        color="lime"
        title="Alert title"
        icon={<IoIosWarning />}
      >
        Don't you have an account?
        <Text ml={"sm"} component={Link} to={"/sign-up"} c="lime">
          Sign Up
        </Text>
      </Alert>
    </Flex>
  );
};

export default Login;
