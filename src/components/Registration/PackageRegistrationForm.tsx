import React, { useState } from "react";
import { useForm } from "@mantine/form";
import {
  Button,
  TextInput,
  Textarea,
  Group,
  Image,
  FileInput,
  Alert,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useMutation, useQueryClient } from "react-query";
import { uploadPackage } from "../../service/api";
import Cookies from "js-cookie";
import { errorMessage } from "../../utils/Error";
import notify from "../../utils/Notify";

interface PackageFormValues {
  pkg_details: string;
  from_where: string;
  to_where: string;
  package_name: string;
  exp_date_to_send: Date | null;
  package_pic: File | null;
}
type PackageFormValue =
  | string
  | number
  | boolean
  | Date
  | File
  | Blob
  | Record<string, unknown>
  | null;

interface PackageFormValues {
  [key: string]: PackageFormValue;
}

interface FunProps {
  close: () => void;
}
const PackageRegistrationForm: React.FC<FunProps> = ({ close }) => {
  const [packagePicPreview, setPackagePicPreview] = useState<string | null>(
    null
  );

  const form = useForm<PackageFormValues>({
    initialValues: {
      pkg_details: "",
      from_where: "",
      to_where: "",
      package_name: "",
      exp_date_to_send: null,
      package_pic: null,
    },
  });

  const token = Cookies.get("token");
  const queryClient = useQueryClient();

  const {
    mutate: upload_pkg,
    isError,
    isLoading,
    error,
  } = useMutation(uploadPackage, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["userProfile"]);
      console.log(data);
      Cookies.set("token", data.msg);
      notify("Upload your package successfully", "success");
      close();
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const handlePackagePicChange = (file: File | null) => {
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPackagePicPreview(previewUrl);
    } else {
      setPackagePicPreview(null);
    }
    form.setFieldValue("package_pic", file);
  };

  const handleSubmit = (values: PackageFormValues) => {
    const formData = new FormData();
    console.log(values);
    Object.keys(values).forEach((key) => {
      const value = values[key];

      if (value instanceof Date) {
        formData.append(key, value.toISOString());
        console.log(value.toISOString());
      } else if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
      } else if (value !== null && !(typeof value === "object")) {
        // Directly append strings, numbers, and booleans, converting numbers and booleans to strings
        formData.append(key, String(value));
      } else if (typeof value === "object" && value !== null) {
        // JSON stringify object values (excluding null, File, and Blob types)
        formData.append(key, JSON.stringify(value));
      }
    });

    upload_pkg({ formData, token });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="Package Name"
        placeholder="Enter package name"
        required
        {...form.getInputProps("package_name")}
      />
      <Textarea
        label="Package Details"
        placeholder="Describe the package"
        required
        {...form.getInputProps("pkg_details")}
      />
      <TextInput
        label="From Where"
        placeholder="Origin"
        required
        {...form.getInputProps("from_where")}
      />
      <TextInput
        label="To Where"
        placeholder="Destination"
        required
        {...form.getInputProps("to_where")}
      />
      <DateTimePicker
        label="Expected Date To Send"
        placeholder="Select expected date and time to send the package"
        required
        value={form.values.exp_date_to_send}
        onChange={(date) => form.setFieldValue("exp_date_to_send", date)}
        dropdownType="modal"
      />
      <FileInput
        label="Package Picture"
        placeholder="Upload a picture of the package"
        accept="image/png, image/jpeg"
        required
        onChange={handlePackagePicChange}
      />
      {packagePicPreview && (
        <Image
          src={packagePicPreview}
          alt="Package preview"
          radius="md"
          height={200}
          width="auto"
          fit="contain"
          style={{ marginTop: "1rem" }}
        />
      )}
      {isError && (
        <Alert color="red" title="Error">
          {errorMessage(error)}
        </Alert>
      )}
      <Group justify="right" mt="md">
        <Button color="lime" type="submit" loading={isLoading}>
          Submit
        </Button>
      </Group>
    </form>
  );
};

export default PackageRegistrationForm;
