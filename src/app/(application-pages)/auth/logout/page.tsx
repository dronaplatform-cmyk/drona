'use client';
import { signOut } from "next-auth/react";



import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/src/components/ui/button';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';
import Link from "next/link";

function LogoutContent() {



  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>You have been logged out</CardTitle>
          <CardDescription>Sign in back to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>

        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Login again?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Click here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LogoutContent />
    </Suspense>
  );
}
