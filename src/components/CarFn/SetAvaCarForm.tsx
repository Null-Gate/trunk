import { Button, Input, Group, Select } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useMemo, useState } from "react";
import useUserStore from "../../Global/userInfo";

interface SetAvailableFormState {
  car_id: string;
  from_where: string;
  to_where: string;
  date_to_go: Date | null;
}

interface SetAvaCarFormProps {
  onSubmit: (formState: SetAvailableFormState) => void;
}

const SetAvaCarForm: React.FC<SetAvaCarFormProps> = ({ onSubmit }) => {
  const [formState, setFormState] = useState<SetAvailableFormState>({
    car_id: "",
    from_where: "",
    to_where: "",
    date_to_go: null,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { userInfo } = useUserStore((state: any) => ({
    userInfo: state.userInfo,
  }));
  //   console.log(userInfo?.own_cars);

  // Transform `userInfo?.own_cars` into a format suitable for the Select component
  const carOptions = useMemo(
    () =>
      userInfo?.own_cars
        ?.filter((car: { is_available: boolean }) => car.is_available === false)
        .map(
          (car: {
            id: { id: { String: string } };
            license_num: string;
            is_available: boolean;
          }) => ({
            value: car.id.id.String,
            label: car.license_num,
          })
        ) || [],
    [userInfo?.own_cars]
  );
  //   console.log(carOptions);

  // Handle change for input fields
  const handleChange =
    (name: keyof SetAvailableFormState) => (value: string | Date | null) => {
      setFormState((prev) => ({ ...prev, [name]: value }));
    };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formState);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Select
        placeholder="Select car ID"
        value={formState.car_id}
        onChange={(value) => handleChange("car_id")(value)}
        data={carOptions}
        mt="md"
      />
      <Input
        placeholder="From where"
        value={formState.from_where}
        onChange={(event) =>
          handleChange("from_where")(event.currentTarget.value)
        }
        mt="md"
      />
      <Input
        placeholder="To where"
        value={formState.to_where}
        onChange={(event) =>
          handleChange("to_where")(event.currentTarget.value)
        }
        mt="md"
      />
      <DateInput
        placeholder="Date to go"
        value={formState.date_to_go}
        onChange={(date: string | Date | null) =>
          handleChange("date_to_go")(date)
        }
        mt="md"
      />
      <Group justify="right" mt="md">
        <Button color={"lime"} type="submit">
          Submit
        </Button>
      </Group>
    </form>
  );
};

export default SetAvaCarForm;
