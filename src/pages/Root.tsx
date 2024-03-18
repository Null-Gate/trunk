import React from "react";
import { useQuery } from "react-query";
import { getNewFeed } from "../service/api";
import Cookies from "js-cookie";
import useNewFeedStore from "../Global/newFeed";
import { NewFeedItem } from "../components/Root/types";
import { CarPostCard } from "../components/Root/CarPostCard";
import { PackageCard } from "../components/Root/PackagePostCard";

const Root: React.FC = () => {
  const token = Cookies.get("token");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { newFeed, setNewFeed } = useNewFeedStore((state: any) => ({
    newFeed: state.newFeed,
    setNewFeed: state.setNewFeed,
  }));

  const { isError, isLoading, error } = useQuery("newFeed", getNewFeed, {
    enabled: !!token,
    onSuccess: (data) => {
      const combinedData = [...data.car_posts, ...data.packages];

      // Shuffle the combined data
      for (let i = combinedData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [combinedData[i], combinedData[j]] = [combinedData[j], combinedData[i]];
      }
      console.log(combinedData);

      // Assuming each item in combinedData has either a date_to_go or date_to_send property
      const formattedCombinedData = combinedData.map((item) => {
        // Determine the correct date property to use
        const dateProperty = item.date_to_go
          ? item.date_to_go
          : item.exp_date_to_send;
        const date = new Date(dateProperty);

        // Format the date
        const formattedDate = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "UTC",
        }).format(date);

        return {
          ...item,
          formattedDate: formattedDate,
        };
      });
      console.log(formattedCombinedData);

      setNewFeed(formattedCombinedData);
    },
    onError: (err: Error) => {
      console.error("Profile fetch failed:", err.message);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div className="flex flex-col p-5 gap-5">
      {newFeed.map((item: NewFeedItem, index: number) => {
        return item.car_info ? (
          <CarPostCard key={index} item={item} />
        ) : item.pkg_details ? (
          <PackageCard key={index} item={item} />
        ) : null;
      })}
    </div>
  );
};

export default Root;
