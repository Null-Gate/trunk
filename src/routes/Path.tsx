import { Route, Routes } from "react-router-dom";
import Login from "../components/Login";
import Root from "../components/Root";
import SignUp from "../components/SignUp";
const Path = () => {
  return (
    <Routes>
      <Route path="/" element={<Root />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  );
};

export default Path;
