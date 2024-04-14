"use client";
import aos from "aos";
import { useEffect } from "react";

import "aos/dist/aos.css";
import "./aos.css";
export const Aos = () => {
  useEffect(() => {
    aos.init({ duration: 500, easing: "ease-in-sine", once: true });
  }, []);
  return null;
};
