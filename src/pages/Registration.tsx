// Registration.tsx
import React from "react";
import DrawerButton from "../utils/DrawerButton";
import { useDisclosure } from "@mantine/hooks";
import CustomDrawer from "../utils/CustomDrawer";
import { GiIdCard } from "react-icons/gi";
import { LuPackageCheck } from "react-icons/lu";
import DriverRegistrationForm from "../components/Registration/DriverRegistrationForm";
import PackageRegistrationForm from "../components/Registration/PackageRegistrationForm";

type RegistrationType = "driver" | "package" | null;

const Registration: React.FC = () => {
  const [registrationType, setRegistrationType] =
    React.useState<RegistrationType>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const handleOpen = (type: RegistrationType) => {
    setRegistrationType(type);
    open();
  };

  return (
    <div className="pt-5">
      <div className="flex justify-around flex-col gap-5">
        <DrawerButton icon={<GiIdCard />} onClick={() => handleOpen("driver")}>
          Register as a driver
        </DrawerButton>
        <DrawerButton
          icon={<LuPackageCheck />}
          onClick={() => handleOpen("package")}
        >
          Upload Package
        </DrawerButton>
      </div>

      <CustomDrawer
        opened={opened && registrationType === "driver"}
        onClose={() => {
          close();
          setRegistrationType(null);
        }}
        title="Driver Registration"
      >
        <DriverRegistrationForm close={close} />
      </CustomDrawer>

      <CustomDrawer
        opened={opened && registrationType === "package"}
        onClose={() => {
          close();
          setRegistrationType(null);
        }}
        title="Upload Package"
      >
        <PackageRegistrationForm close={close} />
      </CustomDrawer>
    </div>
  );
};

export default Registration;
