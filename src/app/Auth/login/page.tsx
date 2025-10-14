"use client";

import { useForm } from "react-hook-form";
import {
  buttonStyle,
  containerStyle,
  errorStyle,
  formStyle,
  inputStyle,
  labelStyle,
  titleStyle,
} from "../auth_styles";
import api from "@/app/api/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import withPublic from "@/app/utils/withPublic";

function page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    setServerError(null);
    try {
      const res = await api.post("/auth/login", data);
      console.log("Usuario registrado:", res.data);
      // Guardar el token
      localStorage.setItem("token", res.data.token);
      if (res.data.token) {
        const login = await api.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${res.data.token}`,
          },
        });
        localStorage.setItem("userId", JSON.stringify(login.data.id));
        // Guardar el rol (si lo devuelve el backend)
        localStorage.setItem("role", login.data.role);
        if (login.data.role === "admin") {
          router.push("/admin/dashboard");
        }
        if (login.data.role === "user") {
          router.push("/user/dashboard");
        }
      }
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      const msg =
        err.response?.data?.message ?? err.response?.data ?? err.message;
      +setServerError(String(msg));
    }
  });

  return (
    <div style={containerStyle as React.CSSProperties}>
      <h1 style={titleStyle}>Login</h1>

      <form onSubmit={onSubmit} style={formStyle as React.CSSProperties}>
        {/* Email */}
        <label style={labelStyle}>Email</label>
        <input
          style={inputStyle}
          type="email"
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          placeholder="email@example.com"
        />
        {errors.email && (
          <span style={errorStyle}>Valid email is required</span>
        )}

        {/* Password */}
        <label style={labelStyle}>Password</label>
        <input
          style={inputStyle}
          type="password"
          {...register("password", { required: true, minLength: 8 })}
          placeholder="Password123"
        />
        {errors.password && (
          <span style={errorStyle}>Password must be at least 8 characters</span>
        )}
        {serverError && <span style={errorStyle}>{serverError}</span>}

        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) =>
            ((e.target as HTMLButtonElement).style.background = "#0a27c9ff")
          }
          onMouseOut={(e) =>
            ((e.target as HTMLButtonElement).style.background = "#0e008bff")
          }
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default withPublic(page);
