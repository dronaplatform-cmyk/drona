'use client';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/src/components/ui/card';
import Link from 'next/link';
import { IconUser, IconSchool, IconBook } from '@tabler/icons-react';
import { usePageTitle } from '@/src/hooks/usePageTitle';
import { LandingHeader } from '@/src/components/Headers';

export default function LoginPage() {
  usePageTitle("Login");

  return (
    <main>

      <div className="flex items-center justify-center min-h-screen p-4">

        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to Drona</CardTitle>
            <CardDescription>Choose your login type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/auth/login/parent" className="block">
              <Button variant="outline" className="w-full  rounded-md  h-16 text-lg justify-start px-6 gap-4 hover:bg-primary/5 hover:text-primary">
                <IconUser className="h-6 w-6" />
                Login as Parent
              </Button>
            </Link>

            <Link href="/auth/login/tutor" className="block">
              <Button variant="outline" className="w-full  rounded-md  h-16 text-lg justify-start px-6 gap-4 hover:bg-primary/5 hover:text-primary">
                <IconSchool className="h-6 w-6" />
                Login as Tutor
              </Button>
            </Link>

            <Link href="/auth/login/student" className="block">
              <Button variant="outline" className="w-full  rounded-md  h-16 text-lg justify-start px-6 gap-4 hover:bg-primary/5 hover:text-primary">
                <IconBook className="h-6 w-6" />
                Login as Student
              </Button>
            </Link>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

    </main>
  );
}
