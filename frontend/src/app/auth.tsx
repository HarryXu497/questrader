"use client";

import auth from "@/lib/firebase/auth";
import useAuthStore from "@/lib/state/authState";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";

export default function AuthListener({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  return children;
}
