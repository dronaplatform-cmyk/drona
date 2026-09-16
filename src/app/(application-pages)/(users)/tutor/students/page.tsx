"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { IconLoader2, IconUser, IconSchool } from "@tabler/icons-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";

interface Student {
  id: string;
  name: string;
  school: string | null;
  _count: {
    classes: number;
  };
}

export default function TutorStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("/api/tutor/students");
      setStudents(response.data);
    } catch (error) {
      toast.error("Failed to fetch students");
    } finally {
      setIsLoading(false);
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
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Students</h1>
        <p className="text-muted-foreground">Students you are currently teaching</p>
      </div>

      {students.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <IconUser className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No students found</p>
            <p className="text-muted-foreground">Students assigned to your classes will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <Card key={student.id}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{student.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <IconSchool className="h-3 w-3" />
                    {student.school || "No school info"}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Total Classes: <span className="font-medium text-foreground">{student._count.classes}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
