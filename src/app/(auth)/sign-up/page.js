"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/validators";
import { useAuth } from "@/context/AuthContext";
import "./page.css"; // import the CSS

export default function SignUpPage() {
  const { user, signup } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    try {
      await signup(data);
      window.location.href = "/dashboard";
    } catch {
      alert("Signup failed!");
    }
  };

  return (
    <div className="signup-container">
      <h1>Create Account</h1>

      <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input placeholder="Full Name" {...register("name")} />
          {errors.name && <p className="error-message">{errors.name.message}</p>}
        </div>

        <div>
          <input placeholder="Username" {...register("username")} />
          {errors.username && <p className="error-message">{errors.username.message}</p>}
        </div>

        <div>
          <input placeholder="Email" {...register("email")} />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div>
          <input type="password" placeholder="Password" {...register("password")} />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
