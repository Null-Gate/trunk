import useUserStore from "../Global/userInfo";
import { Avatar, Badge, Text } from "@mantine/core";
import AdventureCard from "../components/CarFn/AdventureCard";
import { Key } from "react";

const Profile = () => {
  // console.log(userName);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { userInfo } = useUserStore((state: any) => ({
    userInfo: state.userInfo,
  }));

  console.log(userInfo);

  return (
    <div className="p-3">
      <Text
        size="xl"
        fw={900}
        variant="gradient"
        gradient={{
          from: "rgba(26, 26, 26, 1)",
          to: "rgba(140, 126, 126, 1)",
          deg: 90,
        }}
      >
        Profile Information
      </Text>
      {/* profile informaiton  */}
      <div className="flex flex-col gap-5 p-5">
        {/* text information  */}
        <div className="border p-5 flex justify-between shadow rounded">
          <div className="flex justify-around items-center">
            <Avatar
              size="lg"
              radius="sm"
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png"
            />
          </div>
          <div className="flex flex-col justify-around">
            <Text
              size="md"
              fw={900}
              variant="gradient"
              gradient={{ from: "cyan", to: "lime", deg: 90 }}
            >
              Full Name - {userInfo?.fullname}
            </Text>
            <Text
              size="md"
              fw={900}
              variant="gradient"
              gradient={{ from: "cyan", to: "lime", deg: 90 }}
            >
              User Name - {userInfo?.username}
            </Text>
          </div>
        </div>

        {/* user role  */}
        <div className="flex gap-5">
          {userInfo.pik_role.length === 0 ? (
            <Badge color="red">Empty Role Just User</Badge>
          ) : (
            userInfo?.pik_role?.map((el: undefined) => {
              return (
                <Badge key={el} color="lime">
                  {el}
                </Badge>
              );
            })
          )}
        </div>

        <hr className="shadow-md" />
        {/* own carf  */}
        <div className="flex flex-col gap-5">
          {userInfo.own_cars?.map(
            (el: {
              owner_proof: string;
              car_id: { String: string };
              is_available: boolean;
              car_details: string;
              license_num: string;
              id: {
                id: { String: Key | null | undefined };
              };
            }) => {
              return (
                <AdventureCard
                  key={el.car_id.String}
                  title={el.license_num}
                  description={el.car_details}
                  image_url={el.owner_proof}
                  linkUrl={""}
                  is_avaiable={el.is_available}
                />
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
