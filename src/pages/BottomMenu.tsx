import { useState } from "react";
import { BsPeopleFill } from "react-icons/bs";
import { BiSolidCategory } from "react-icons/bi";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { TbCar } from "react-icons/tb";
import { TbRegistered } from "react-icons/tb";


const BottomMenu = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(true);
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev: number = scrollY.getPrevious()!;
    if (prev < latest) {
      setOpen(false);
      setHidden(false);
    } else {
      setHidden(true);
    }
  });

  const menuVarient = {
    initial: {
      y: "160%",
    },
    animate: {
      y: 0,
    },
  };

  const navMenuInitial = {
    x: -6,
    y: -5,
    opacity: 0,
    rotate: 45,
    borderRadius: "100%",
  };

  const navMenu1 = {
    animate: { x: 0, y: "-120%", rotate: 0 },
    initial: navMenuInitial,
    exit: { opacity: 0 },
  };
  const navMenu2 = {
    animate: { x: "-120%", y: "-120%", rotate: 0 },
    initial: navMenuInitial,
    exit: { opacity: 0 },
  };
  const navMenu3 = {
    animate: { x: "-120%", y: 0, rotate: 0 },
    initial: navMenuInitial,
    exit: { opacity: 0 },
  };

  const menuNav = [
    {
      id: 1,
      variant: navMenu1,
      delay: 0.1,
      link: "/carfn",
      icon: <TbCar />,
    },
    {
      id: 2,
      variant: navMenu2,
      delay: 0.2,
      link: "/register",
      icon: <TbRegistered />,
    },
    {
      id: 3,
      variant: navMenu3,
      delay: 0.3,
      link: "/users",
      icon: <BsPeopleFill />,
    },
  ];

  return (
    <motion.div
      variants={menuVarient}
      initial="initial"
      animate={hidden ? "animate" : "initial"}
      className={`fixed bg-lime-600 text-white bottom-3 right-3  w-12 h-12 flex justify-center items-center text-3xl rounded-full bg-primary text-secondary`}
    >
      {menuNav.map((el) => (
        <motion.div
          key={el.id}
          variants={el.variant}
          animate={open ? "animate" : "initial"}
          transition={{ duration: 0.3, delay: el.delay, ease: "backInOut" }}
          onClick={() => {
            nav(el.link);
            setOpen(false);
          }}
          className="absolute bg-lime-600 text-white rounded-md bg-primary w-11 h-11 text-xl flex justify-center items-center -z-10"
        >
          {el.icon}
        </motion.div>
      ))}
      <div onClick={() => setOpen(!open)}>
        <BiSolidCategory
          className={`${
            open
              ? "rotate-45 opacity-0"
              : "rotate-0 absolute transition-all duration-500"
          }`}
        />
        <RxCross2
          className={`${
            !open
              ? "-rotate-45 opacity-0"
              : "rotate-0 absolute top-2 transition-all duration-500"
          }`}
        />
      </div>
    </motion.div>
  );
};

export default BottomMenu;
