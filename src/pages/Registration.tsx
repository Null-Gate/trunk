import React, { useState } from "react";
import { Button, Modal } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import CarForm from "../components/CarFn/CarForm";
import SetAvaCarForm from "../components/CarFn/SetAvaCarForm";
import DriverRegistrationForm from "../components/Registration/DriverRegistrationForm";
import PackageRegistrationForm from "../components/Registration/PackageRegistrationForm";
import DrawerButton from "../utils/DrawerButton";
import CustomDrawer from "../utils/CustomDrawer";
import { GiCarWheel, GiCheckMark, GiIdCard } from "react-icons/gi";
import { LuPackageCheck } from "react-icons/lu";
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

type RegistrationType = "driver" | "package" | null;

const CombinedComponent: React.FC = () => {
  // CarFn state management
  const [openedCarFn, { open: openCarFn, close: closeCarFn }] =
    useDisclosure(false);
  const [currentAction, setCurrentAction] = useState<
    "uploadCar" | "setAvailableCar"
  >("uploadCar");
  const queryClient = useQueryClient();
  const token = Cookies.get("token");

  // Registration state management
  const [registrationType, setRegistrationType] =
    useState<RegistrationType>(null);
  const [
    openedRegistration,
    { open: openRegistration, close: closeRegistration },
  ] = useDisclosure(false);

  // CarFn handlers
  const handleSuccess = (data: { msg: string }) => {
    queryClient.invalidateQueries(["userProfile"]);
    Cookies.set("token", data?.msg);
    console.log(data);
    notify("Operation successful", "success");
    closeCarFn();
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

  const renderCarFnForm = () => {
    switch (currentAction) {
      case "uploadCar":
        return <CarForm onSubmit={handleUploadCarSubmit} />;
      case "setAvailableCar":
        return <SetAvaCarForm onSubmit={handleSetAvailableCarSubmit} />;
      default:
        return null;
    }
  };

  // Registration handlers
  const handleOpen = (type: RegistrationType) => {
    setRegistrationType(type);
    openRegistration();
  };

  return (
    <div className="p-5 flex flex-col">
      <Modal
        opened={openedCarFn}
        onClose={closeCarFn}
        title={
          currentAction === "uploadCar" ? "Upload Car" : "Set Available Car"
        }
        centered
      >
        {renderCarFnForm()}
      </Modal>

      {/* Registration component */}
      <div className="pt-5">
        <div className="flex justify-around flex-col gap-5">
          <DrawerButton
            icon={<GiIdCard />}
            onClick={() => handleOpen("driver")}
          >
            Register as a driver
          </DrawerButton>
          <DrawerButton
            icon={<LuPackageCheck />}
            onClick={() => handleOpen("package")}
          >
            Upload Package
          </DrawerButton>
          <Button
            variant="light"
            color="lime"
            leftSection={<GiCarWheel size={14} />}
            rightSection={<IconArrowRight size={14} />}
            onClick={() => {
              setCurrentAction("uploadCar");
              openCarFn();
            }}
          >
            Upload Car
          </Button>
          <Button
            variant="light"
            color="lime"
            leftSection={<GiCheckMark size={14} />}
            rightSection={<IconArrowRight size={14} />}
            onClick={() => {
              setCurrentAction("setAvailableCar");
              openCarFn();
            }}
          >
            Set Available Car
          </Button>
        </div>

        <CustomDrawer
          opened={openedRegistration && registrationType === "driver"}
          onClose={() => {
            closeRegistration();
            setRegistrationType(null);
          }}
          title="Driver Registration"
        >
          <DriverRegistrationForm close={closeRegistration} />
        </CustomDrawer>

        <CustomDrawer
          opened={openedRegistration && registrationType === "package"}
          onClose={() => {
            closeRegistration();
            setRegistrationType(null);
          }}
          title="Upload Package"
        >
          <PackageRegistrationForm close={closeRegistration} />
        </CustomDrawer>
      </div>
    </div>
  );
};

export default CombinedComponent;
