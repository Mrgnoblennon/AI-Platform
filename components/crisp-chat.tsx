"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("d00a2bae-2310-40da-ae90-d46c62257503")
  }, []);

  return null;
}