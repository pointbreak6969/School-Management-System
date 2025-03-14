"use client";
import Link from "next/link";
import React from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signUpSchema } from "../../schemas/signUpSchema";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

const Page = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/signup", data);
      if (response.data.success) {
        toast.success(response.data.message);
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        router.push("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center mb-6 text-gray-800">
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-semibold mb-1"
              >
                Name
              </label>
              <Input
                {...register("username")}
                type="text"
                id="name"
                placeholder="Enter your name"
                className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-teal-500 focus:border-teal-500 transition duration-200"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
              )}
            </div>

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
                className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-teal-500 focus:border-teal-500 transition duration-200"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-4">
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
                className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-teal-500 focus:border-teal-500 transition duration-200"
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
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">Already have an account?</p>
            <Link
              href="/signin"
              className="text-teal-600 hover:text-teal-700 font-semibold"
            >
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
