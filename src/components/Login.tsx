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
} from "@mantine/core";

import { loginUser } from "../service/api";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

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
      Cookies.set("token", data?.msg);
      if (data?.msg) {
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
    <Flex h={"100vh"} justify={"center"} align={"center"}>
      <Box style={{ width: "100vw", maxWidth: 340 }} mx="auto">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Username"
            placeholder="Username"
            {...form.getInputProps("username")}
          />
          <PasswordInput
            label="Password"
            mt={"md"}
            placeholder="Input placeholder"
            {...form.getInputProps("password")}
          />
          <Group justify="center" mt="xl">
            <Button type="submit" w={"100%"} disabled={isLoading}>
              Login
            </Button>
          </Group>
          {isError && (
            <div>
              Error logging in:{" "}
              {error instanceof Error
                ? error.message
                : "An unknown error occurred"}
            </div>
          )}
        </form>
      </Box>
    </Flex>
  );
};

export default Login;
