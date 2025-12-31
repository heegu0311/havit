"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

const ClarityInitializer = () => {
  useEffect(() => {
    // Replace with actual Clarity project ID.
    Clarity.init("ues68jf7z3");
  }, []);
  return <></>;
};

export default ClarityInitializer;
