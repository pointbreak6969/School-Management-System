"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { signInSchema } from "../../schemas/signInSchema";
import { Loader2 } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      
      if (!response) {
        throw new Error("Network error - couldn't connect to authentication service");
      }
      
      if (response.error) {
        // Handle specific error messages
        if (response.error.includes("credentials")) {
          toast.error("Invalid email or password. Please try again.");
        } else {
          toast.error(response.error);
        }
        return;
      }
      
      toast.success("Sign in successful!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-8">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center mb-6 text-gray-800">
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-semibold mb-1"
              >
                Email
              </label>
              <Input
                {...register("email")}
                type="email"
                id="email"
                placeholder="Enter your email"
                className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-teal-500 focus:border-teal-500 transition duration-200 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-semibold mb-1"
              >
                Password
              </label>
              <Input
                {...register("password")}
                type="password"
                id="password"
                placeholder="Enter your password"
                className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-teal-500 focus:border-teal-500 transition duration-200 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded transition duration-200 focus:outline-none focus:ring focus:ring-teal-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">Don't have an account?</p>
            <Link
              href="/signup"
              className="text-teal-600 hover:text-teal-700 font-semibold"
            >
              Sign Up Here
            </Link>
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/passwordReset"
              className="text-teal-600 hover:text-teal-700 font-semibold"
            >
              Forgot Password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;