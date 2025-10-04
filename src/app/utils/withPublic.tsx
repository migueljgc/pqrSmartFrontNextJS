"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function withPublic(Component: React.ComponentType) {
  return function PublicPage(props: any) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        // Si ya hay token, redirige al dashboard
        router.push("/dashboard");
      }
    }, [router]);

    return <Component {...props} />;
  };
}
