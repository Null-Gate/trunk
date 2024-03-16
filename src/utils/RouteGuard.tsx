import React, { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getUser } from "../service/api";
import useUserStore from "../Global/userInfo";
import Cookies from "js-cookie";

interface RouteGuardProps {
  element: ReactElement;
  path?: string;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ element, ...rest }) => {
  const token = Cookies.get("token");
  const userName = Cookies.get("name");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { setUserInfo } = useUserStore((state: any) => ({
    setUserInfo: state.setUserInfo,
  }));

  const { isError, isLoading, error } = useQuery(
    ["userProfile", userName],
    () => getUser(userName),
    {
      enabled: !!token && !!userName,
      onSuccess: (data) => {
        // console.log(data);
        setUserInfo(data);
      },
      onError: (err) => {
        console.error("Profile fetch failed:", err);
      },
      // refetchInterval: 5000,
    }
  );

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (isError) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : "An error occurred"}
      </div>
    );
  }

  // Redirect if no token is found; otherwise, render the protected element.
  return token ? (
    React.cloneElement(element, rest)
  ) : (
    <Navigate to="/login" replace />
  );
};

export default RouteGuard;
