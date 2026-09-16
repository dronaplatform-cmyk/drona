"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/src/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminSetupPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSetup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to setup admin");
      }

      toast.success("Admin user created successfully! Please login.");
      router.push("/auth/login");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center -mt-20">
      <Card className="w-full max-w-md mx-auto shadow-lg border-primary/20">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Admin Initialization</CardTitle>
          <CardDescription>Enter the system master secret to create the first admin.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetup} className="space-y-4">
            <div className="space-y-2">
              <Label>Master Secret Key</Label>
              <Input name="secretKey" type="password" required placeholder="super-secret-key" />
            </div>
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input name="fullname" required placeholder="System Admin" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input name="email" type="email" required placeholder="admin@drona.ext" />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input name="phoneNumber" type="tel" required placeholder="1234567890" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input name="password" type="password" required placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "Forging Admin..." : "Initialize Admin"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
