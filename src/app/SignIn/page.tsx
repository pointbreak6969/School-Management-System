"use client";
import Link from 'next/link';
import React, { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const page = () => {
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = (event: FormEvent) => {
    event.preventDefault();

    // Add your sign-in logic here
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center mb-6 text-gray-800">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignIn}>
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
            <div className="mb-6">
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

            {/* Sign In Button */}
            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded transition duration-200 focus:outline-none focus:ring focus:ring-teal-300">
              Sign In
            </Button>
          </form>

          {/* Links */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">Don't have an account?</p>
            <Link href="/signUp" className="text-teal-600 hover:text-teal-700 font-semibold">
              Sign Up Here
            </Link>
          </div>
          <div className="mt-4 text-center">
            <Link href="/passwordReset" className="text-teal-600 hover:text-teal-700 font-semibold">
              Forgot Password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;