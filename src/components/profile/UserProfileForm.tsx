"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { IconLoader2, IconDeviceFloppy } from "@tabler/icons-react";
import { toast } from "sonner";

const userProfileSchema = z.object({
  fullname: z.string().min(2, "Full name must be at least 2 characters"),
  phoneNumber: z.string()
    .min(10, "Phone number must be at least 10 digits.")
    .max(15, "Phone number must be at most 15 digits."),
});

type UserProfileFormValues = z.infer<typeof userProfileSchema>;

export default function UserProfileForm() {
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<UserProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      fullname: "",
      phoneNumber: "",
    },
  });

  const fetchProfile = useCallback(async () => {
    try {
      const response = await axios.get("/api/profile");
      if (response.data) {
        form.reset({
          fullname: response.data.fullname || "",
          phoneNumber: response.data.phoneNumber || "",
        });
      }
    } catch {
      toast.error("Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onSubmit = async (data: UserProfileFormValues) => {
    try {
      await axios.put("/api/profile", data);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <IconLoader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal details</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <IconDeviceFloppy className="mr-2 h-4 w-4" />
              Save Profile
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
