"use client";
import { LuSun } from "react-icons/lu";
import { useTheme } from "next-themes";
import { RiMoonFill } from "react-icons/ri";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      {theme === "light" ? (
        <span onClick={() => setTheme("dark")}>
          <RiMoonFill size={20} className=' text-dark' />{" "}
        </span>
      ) : (
        <span onClick={() => setTheme("light")}>
          <LuSun size={20} className='!fill-none text-dark' />
        </span>
      )}
    </div>
  );
}
