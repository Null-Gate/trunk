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

import { signUp } from "../service/api";
import { Link, useNavigate } from "react-router-dom";
import { IoIosWarning } from "react-icons/io";

const SignUp = () => {
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
      fullname: "",
    },
  });
  const nav = useNavigate();

  const {
    mutate: login,
    isLoading,
    isError,
    error,
  } = useMutation(signUp, {
    onSuccess: (data) => {
      console.log("Login successful:", data);
      // Cookies.set("token", data?.msg);
      if (data?.msg) {
        nav("/login");
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(form.values);
    // console.log(form.values)
  };

  return (
    <Flex
      gap={15}
      direction={"column"}
      h={"70vh"}
      justify={"center"}
      align={"center"}
    >
      <Box style={{ width: "100vw", maxWidth: 340 }} mx="auto">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Username"
            placeholder="Username"
            {...form.getInputProps("username")}
          />
          <TextInput
            mt={"md"}
            label="Full Name"
            placeholder="Full Name"
            {...form.getInputProps("fullname")}
          />
          <PasswordInput
            label="Password"
            mt={"md"}
            placeholder="Input placeholder"
            {...form.getInputProps("password")}
          />
          <Group justify="center" mt="xl">
            <Button color="lime" type="submit" w={"100%"} disabled={isLoading}>
              Sign-Up
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
      <Alert
        variant="light"
        color="lime"
        title="Alert title"
        icon={<IoIosWarning />}
      >
        Do you already have an account ?
        <Text ml={"sm"} component={Link} to={"/login"} c="lime">
          Login
        </Text>
      </Alert>
    </Flex>
  );
};

export default SignUp;
