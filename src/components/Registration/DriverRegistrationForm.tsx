import React, { useState } from "react";
import { useForm } from "@mantine/form";
import {
  Button,
  FileInput,
  TextInput,
  Textarea,
  Group,
  Image,
  Alert,
} from "@mantine/core";
import { useMutation, useQueryClient } from "react-query";
import { registrationAsDriver } from "../../service/api";
import Cookies from "js-cookie";
import notify from "../../utils/Notify";

interface FormValues {
  license_num: string;
  license_pic: File | null;
  exp_details: string;
}
interface FunProps {
  close: () => void;
}
const DriverRegistrationForm: React.FC<FunProps> = ({ close }) => {
  const [licensePicPreview, setLicensePicPreview] = useState<string | null>(
    null
  );
  const form = useForm<FormValues>({
    initialValues: {
      license_num: "",
      license_pic: null,
      exp_details: "",
    },

    validate: {
      license_num: (value) =>
        /^[A-Za-z0-9]+$/.test(value) ? null : "Invalid license number",
      exp_details: (value) =>
        value.length > 0 ? null : "Expiration details are required",
    },
  });

  const handleLicensePicChange = (file: File | null) => {
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setLicensePicPreview(previewUrl);
      form.setFieldValue("license_pic", file);
    } else {
      setLicensePicPreview(null);
    }
  };

  const token = Cookies.get("token");
  const userName = Cookies.get("name");
  const queryClient = useQueryClient();

  const {
    mutate: registration_as_driver,
    isError,
    isLoading,
  } = useMutation(registrationAsDriver, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["userProfile", userName]);
      console.log("upload successful:", data);
      Cookies.set("token", data?.msg);
      notify("Register as driver successfully", "success");
      close();
    },
    onError: (err) => {
      console.error("upload failed:", err);
    },
  });

  const handleSubmit = (values: FormValues) => {
    const formData = new FormData();

    formData.append("license_num", values.license_num);
    formData.append("exp_details", values.exp_details);

    if (values.license_pic) {
      formData.append("license_pic", values.license_pic);
    }

    registration_as_driver({ formData, token });
  };

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <TextInput
        required
        label="License Number"
        placeholder="Your License Number"
        {...form.getInputProps("license_num")}
      />

      <FileInput
        label="License Picture"
        placeholder="Upload your license picture"
        accept="image/png, image/jpeg"
        required
        {...form.getInputProps("license_pic")}
        onChange={(file) => handleLicensePicChange(file)}
      />

      {licensePicPreview && (
        <Image
          src={licensePicPreview}
          alt="License preview"
          radius="md"
          h={200}
          w="auto"
          fit="contain"
          mt="sm"
        />
      )}

      <Textarea
        required
        label="Expiration Details"
        placeholder="Details about your license expiration"
        {...form.getInputProps("exp_details")}
      />

      {/* Display an error alert if submission fails */}
      {isError && (
        <Alert color="red" title="Error!">
          Failed to submit the form. Please try again.
        </Alert>
      )}

      <Group justify="right" mt="md">
        <Button color="lime" type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </Group>
    </form>
  );
};

export default DriverRegistrationForm;
