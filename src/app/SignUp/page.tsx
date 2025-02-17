"use client";
import Link from 'next/link';
import React, { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {zodResolver} from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import * as zod from "zod";
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
const page = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const {toast}  = useToast();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center mb-6 text-gray-800">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form >
            {/* Name Field */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-1">
                Name
              </label>
              <Input
                type="text"
                id="name"
                placeholder="Enter your name"
                className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-teal-500 focus:border-teal-500 transition duration-200"
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-1">
                Email
              </label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-teal-500 focus:border-teal-500 transition duration-200"
              />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-1">
                Password
              </label>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-teal-500 focus:border-teal-500 transition duration-200"
              />
            </div>

            {/* Sign Up Button */}
            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded transition duration-200 focus:outline-none focus:ring focus:ring-teal-300">
              Sign Up
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">Already have an account?</p>
            <Link href="/signIn" className="text-teal-600 hover:text-teal-700 font-semibold">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;