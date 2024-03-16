import { Avatar, Indicator } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";

const Nav = () => {
  const nav = useNavigate();
  return (
    <div className=" flex justify-between items-center shadow-md h-[13vh] p-5">
      <Link to={"/"} className="font-bold text-lg">
        LOGO
      </Link>
      <Indicator inline processing onClick={() => nav("/profile")} color="lime">
        <Avatar
          size="lg"
          radius="sm"
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png"
        />
      </Indicator>
    </div>
  );
};

export default Nav;
