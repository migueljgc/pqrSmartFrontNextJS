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
import withPublic from "@/app/utils/withPublic";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <div style={containerStyle as React.CSSProperties}>
      <h1 style={titleStyle}>Register</h1>

      <form onSubmit={onSubmit} style={formStyle as React.CSSProperties}>
        {/* Username */}
        <label style={labelStyle}>Username</label>
        <input
          style={inputStyle}
          onMouseOver={(e) =>
            ((e.target as HTMLButtonElement).style.background = "#b6b6b6ff")
          }
          onMouseOut={(e) =>
            ((e.target as HTMLButtonElement).style.background = "#f1f1f1ff")
          }
          type="text"
          {...register("username", { required: true, maxLength: 20 })}
          placeholder="Username123"
        />
        {errors.username && (
          <span style={errorStyle}>Username is required</span>
        )}

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

        {/* Confirm Password */}
        <label style={labelStyle}>Confirm Password</label>
        <input
          style={inputStyle}
          type="password"
          {...register("confirmPassword", { required: true, minLength: 8 })}
          placeholder="Confirm Password"
        />
        {errors.confirmPassword && (
          <span style={errorStyle}>Please confirm your password</span>
        )}

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
          Register
        </button>
      </form>
    </div>
  );
}

export default withPublic(RegisterPage);
