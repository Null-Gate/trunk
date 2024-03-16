import { Button, FileInput, Input, Textarea, Group, rem } from "@mantine/core";
import { IconFile } from "@tabler/icons-react";
import { useState } from "react";

interface FormState {
  license_num: string;
  owner_proof: File | null;
  car_details: string;
}

interface FunProps {
  onSubmit: (formState: FormState) => void;
}
const CarForm: React.FC<FunProps> = ({ onSubmit }) => {
  const [formState, setFormState] = useState({
    license_num: "",
    owner_proof: null,
    car_details: "",
  });

  const handleChange = (name: string) => (value: unknown) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    onSubmit(formState);
  };

  const icon = (
    <IconFile style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
  );

  return (
    <form onSubmit={handleSubmit}>
      <Input
        placeholder="Enter license number"
        value={formState.license_num}
        onChange={(event) =>
          handleChange("license_num")(event.currentTarget.value)
        }
        mt="md"
      />
      <FileInput
        leftSection={icon}
        placeholder="Upload owner proof"
        value={formState.owner_proof}
        onChange={handleChange("owner_proof")}
        mt="md"
        accept="image/*,application/pdf"
      />
      <Textarea
        placeholder="Enter car details"
        value={formState.car_details}
        onChange={(event) =>
          handleChange("car_details")(event.currentTarget.value)
        }
        mt="md"
      />
      <Group justify="right" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
};

export default CarForm;
