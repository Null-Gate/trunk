import React, { useState } from "react";
import useUserStore from "../Global/userInfo";
import { Avatar, Badge, Button, Text } from "@mantine/core";
import AdventureCard from "../components/CarFn/AdventureCard";
import { PackageCard } from "../components/Root/PackagePostCard";
import { NewFeedItem } from "../components/Root/types";

const Profile = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { userInfo } = useUserStore((state: any) => ({
    userInfo: state.userInfo,
  }));

  // State to toggle between showing cars and packages
  const [showSection, setShowSection] = useState("Car"); // Default to showing cars

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

      <div className="flex flex-col gap-5 p-5">
        <div className="border p-5 flex justify-between shadow rounded">
          <Avatar
            size="lg"
            radius="sm"
            src={
              "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png"
            }
          />
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

        <div className="flex gap-5">
          {userInfo.pik_role.length === 0 ? (
            <Badge color="red">Empty Role Just User</Badge>
          ) : (
            userInfo?.pik_role?.map(
              (
                role:
                  | string
                  | number
                  | boolean
                  | React.ReactElement<
                      unknown,
                      string | React.JSXElementConstructor<unknown>
                    >
                  | Iterable<React.ReactNode>
                  | React.ReactPortal
                  | null
                  | undefined,
                index: React.Key | null | undefined
              ) => (
                <Badge key={index} color="lime">
                  {role}
                </Badge>
              )
            )
          )}
        </div>

        <hr className="shadow-md" />

        {/* Toggle buttons */}
        <div className="flex gap-2 mb-4">
          <Button
            color={"lime"}
            variant={showSection === "Car" ? "filled" : "outline"}
            onClick={() => setShowSection("Car")}
          >
            Cars
          </Button>
          <Button
            color={"lime"}
            variant={showSection === "Package" ? "filled" : "outline"}
            onClick={() => setShowSection("Package")}
          >
            Packages
          </Button>
        </div>

        {/* Dynamic section rendering */}
        <div className="flex flex-col gap-5">
          {showSection === "Car" &&
            userInfo.own_cars?.map(
              (car: {
                car_id: { String: React.Key | null | undefined };
                license_num: string;
                car_details: string;
                owner_proof: string;
                is_available: boolean;
              }) => (
                <AdventureCard
                  key={car.car_id.String}
                  title={car.license_num}
                  description={car.car_details}
                  image_url={car.owner_proof}
                  is_avaiable={car.is_available}
                  linkUrl={""}
                />
              )
            )}

          {showSection === "Package" &&
            userInfo.packages?.map(
              (pkg: NewFeedItem, index: React.Key | null | undefined) => (
                <PackageCard key={index} item={pkg} />
              )
            )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
