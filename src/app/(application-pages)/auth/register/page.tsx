'use client';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/src/components/ui/card';
import Link from 'next/link';
import { IconUser, IconSchool } from '@tabler/icons-react';
import { usePageTitle } from '@/src/hooks/usePageTitle';

export default function RegisterPage() {
  usePageTitle("Register");

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Choose your account type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/auth/register/parent" className="block">
            <Button variant="outline" className="w-full rounded-md h-16 text-lg justify-start px-6 gap-4 hover:bg-primary/5 hover:text-primary">
              <IconUser className="h-6 w-6" />
              Register as Parent
            </Button>
          </Link>

          <Link href="/auth/register/tutor" className="block">
            <Button variant="outline" className="w-full rounded-md h-16 text-lg justify-start px-6 gap-4 hover:bg-primary/5 hover:text-primary">
              <IconSchool className="h-6 w-6" />
              Register as Tutor
            </Button>
          </Link>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
