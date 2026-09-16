"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { IconLoader2, IconBook, IconCheck } from "@tabler/icons-react";
import { toast } from "sonner";
import { Badge } from "@/src/components/ui/badge";

interface Homework {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  status: string;
  class: {
    tutor: {
      user: {
        fullname: string;
      };
    };
  };
}

import { usePageTitle } from "@/src/hooks/usePageTitle";

export default function StudentHomeworkPage() {
  usePageTitle("Homework Assignments");
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHomeworks();
  }, []);

  const fetchHomeworks = async () => {
    try {
      const response = await axios.get("/api/student/homework");
      setHomeworks(response.data);
    } catch (error) {
      toast.error("Failed to fetch homework");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Homework</h1>
        <p className="text-muted-foreground">Your assignments and tasks</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <IconLoader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : homeworks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <IconBook className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No homework assigned</p>
            <p className="text-muted-foreground">You are all caught up!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {homeworks.map((hw) => (
            <Card key={hw.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-1" title={hw.title}>{hw.title}</CardTitle>
                  <Badge variant={hw.status === "COMPLETED" ? "default" : "secondary"}>
                    {hw.status}
                  </Badge>
                </div>
                <CardDescription>
                  Due: {hw.dueDate ? new Date(hw.dueDate).toLocaleDateString() : "No due date"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {hw.description || "No description provided."}
                </p>
                <div className="text-xs text-muted-foreground mt-auto pt-4 border-t">
                  Tutor: {hw.class.tutor.user.fullname}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
