import React, { useState } from "react";
import { Group, Button, Modal } from "@mantine/core";
import { IconPhoto, IconArrowRight } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import CarForm from "../components/CarFn/CarForm";
import SetAvaCarForm from "../components/CarFn/SetAvaCarForm";
import { useMutation, useQueryClient } from "react-query";
import Cookies from "js-cookie";
import { setAvailableCar, uploadCar } from "../service/api";
import notify from "../utils/Notify";

interface UploadCarFormData {
  license_num: string;
  owner_proof: File | null;
  car_details: string;
}

interface SetAvailableCarFormData {
  car_id: string;
  from_where: string;
  to_where: string;
  date_to_go: Date | null;
}

const CarFn: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [currentAction, setCurrentAction] = useState<
    "uploadCar" | "setAvailableCar"
  >("uploadCar");
  const queryClient = useQueryClient();
  const token = Cookies.get("token");

  const handleSuccess = (data: { msg: string }) => {
    queryClient.invalidateQueries(["userProfile"]);
    Cookies.set("token", data?.msg);
    console.log(data);
    notify("Operation successful", "success");
    close();
  };

  const handleError = (error: Error) => {
    console.error("Operation failed:", error);
    notify(`Operation failed: ${error.message}`, "error");
  };

  const uploadCarMutation = useMutation(uploadCar, {
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const setAvailableCarMutation = useMutation(setAvailableCar, {
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const handleUploadCarSubmit = async (formData: UploadCarFormData) => {
    // Construct FormData for file upload
    const data = new FormData();
    data.append("license_num", formData.license_num);
    data.append("car_details", formData.car_details);
    if (formData.owner_proof) {
      data.append("owner_proof", formData.owner_proof);
    }
    uploadCarMutation.mutate({ formData: data, token });
  };

  const handleSetAvailableCarSubmit = (data: SetAvailableCarFormData) => {
    const payload = {
      ...data,
      date_to_go: data.date_to_go ? data.date_to_go.toISOString() : null,
    };

    setAvailableCarMutation.mutate({
      data: payload,
      token: token as string,
    });
  };

  const renderForm = () => {
    switch (currentAction) {
      case "uploadCar":
        return <CarForm onSubmit={handleUploadCarSubmit} />;
      case "setAvailableCar":
        return <SetAvaCarForm onSubmit={handleSetAvailableCarSubmit} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-5 flex flex-col">
      <Group justify="center">
        <Button
          color="lime"
          leftSection={<IconPhoto size={14} />}
          rightSection={<IconArrowRight size={14} />}
          onClick={() => {
            setCurrentAction("uploadCar");
            open();
          }}
        >
          Upload Car
        </Button>
        <Button
          color="lime"
          leftSection={<IconPhoto size={14} />}
          rightSection={<IconArrowRight size={14} />}
          onClick={() => {
            setCurrentAction("setAvailableCar");
            open();
          }}
        >
          Set Available Car
        </Button>
      </Group>

      <Modal
        opened={opened}
        onClose={close}
        title={
          currentAction === "uploadCar" ? "Upload Car" : "Set Available Car"
        }
        centered
      >
        {renderForm()}
      </Modal>

      {(uploadCarMutation.isLoading || setAvailableCarMutation.isLoading) && (
        <div>Loading...</div>
      )}
      {(uploadCarMutation.isError || setAvailableCarMutation.isError) && (
        <div>
          Error:
          {(uploadCarMutation.error || setAvailableCarMutation.error) instanceof
          Error
            ? (uploadCarMutation.error || setAvailableCarMutation.error).message
            : "An error occurred"}
        </div>
      )}
    </div>
  );
};

export default CarFn;
