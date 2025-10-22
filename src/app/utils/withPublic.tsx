"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function withPublic(Component: React.ComponentType) {
  return function PublicPage(props: any) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (token) {
        if (role === "admin") {
          router.push("/admin/home");
          return;
        }
        if (role === "user") {
          router.push("/user/dashboard");
          return;
        }
        if (role === "secretariat") {
          router.push("/secretariat/dashboard");
          return;
        }
        // Si ya hay token, redirige al dashboard
        router.push("/dashboard");
      }
    }, [router]);

    return <Component {...props} />;
  };
}
