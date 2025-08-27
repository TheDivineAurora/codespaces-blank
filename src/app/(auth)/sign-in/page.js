"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema } from "@/lib/validators";
import { useAuth } from "@/context/AuthContext";
import "./page.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, signin } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(signinSchema) });

  const onSubmit = async (data) => {
    const success = await signin(data);
    if(!success) return alert("Sign In Failed")
  };

  useEffect(() => {
    if(user) router.push('/dashboard')
  }, [user])

  return (
    <div className="login-container">
      <h1>Sign In</h1>
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Email" {...register("email")} />
        {errors.email && <p className="error">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
