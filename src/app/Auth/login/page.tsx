"use client";

import { useForm } from "react-hook-form";
import api from "@/app/api/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import withPublic from "@/app/utils/withPublic";
import HeaderLogin from "@/app/components/headerLogin";

function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    try {
      const res = await api.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);

      if (res.data.token) {
        const login = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${res.data.token}` },
        });

        localStorage.setItem("userId", JSON.stringify(login.data.id));
        localStorage.setItem("role", login.data.role);
        localStorage.setItem(
          "initial",
          login.data.name.charAt(0).toUpperCase()
        );

        if (login.data.role === "admin") router.push("/admin/home");
        if (login.data.role === "user") router.push("/user/home");
        if (login.data.role === "secretariat") {
          localStorage.setItem("type", login.data.pqrsType.id);
          router.push("/secretariat/dashboard");
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message ?? err.message;
      setServerError(String(msg));
    }
  });

  return (
    <div className="overflow-hidden h-screen flex flex-col bg-[#023047]">
      {/* Header superior */}
      <HeaderLogin />
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-b text-white ">
        <div className="flex flex-col items-center mt-8">
          <h1 className="text-3xl font-bold mb-6">Login</h1>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-[#023053] text-gray-900 p-6 rounded-xl shadow-2xl w-full max-w-md"
        >
          {/* Email */}
          <label className="mb-1 font-semibold block text-white">Email</label>
          <input
            type="email"
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            placeholder="email@example.com"
            className="mb-6 bg-white w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">
              Valid email is required
            </span>
          )}

          {/* Password */}
          <label className="mb-1 font-semibold block text-white">
            Password
          </label>
          <input
            type="password"
            {...register("password", { required: true, minLength: 8 })}
            placeholder="Password123"
            className="mb-6 bg-white w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              Password must be at least 8 characters
            </span>
          )}

          {/* ✅ Remember me & Forgot password */}
          <div className="flex items-center justify-between mt-3 mb-4 text-sm">
            <label className="text-blue-600 flex items-center gap-2 hover:underline font-medium">
              <input
                type="checkbox"
                className="accent-blue-600 w-4 h-4"
                {...register("remember")}
              />
              <span>Remember me</span>
            </label>
            <a
              href="/auth/forgot-password"
              className="text-blue-600  font-medium"
            >
              Forgot password?
            </a>
          </div>

          {serverError && (
            <span className="text-red-500 text-sm">{serverError}</span>
          )}

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition-colors mt-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default withPublic(Page);
