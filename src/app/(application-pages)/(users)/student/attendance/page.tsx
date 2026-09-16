"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { IconLoader2, IconCalendarCheck, IconCheck } from "@tabler/icons-react";
import { toast } from "sonner";

interface Session {
  id: string;
  scheduledAt: string;
  tutor: {
    user: {
      fullname: string;
    };
  };
}

import { usePageTitle } from "@/src/hooks/usePageTitle";

export default function StudentAttendancePage() {
  usePageTitle("Attendance Records");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get("/api/student/attendance");
      setSessions(response.data);
    } catch (error) {
      toast.error("Failed to fetch attendance");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attendance</h1>
        <p className="text-muted-foreground">Your class attendance history</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <IconLoader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : sessions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <IconCalendarCheck className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No attendance records</p>
            <p className="text-muted-foreground">Attendance marked by tutors will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <Card key={session.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <IconCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Present</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.scheduledAt).toLocaleDateString()} • {new Date(session.scheduledAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-sm font-medium">
                  Tutor: {session.tutor.user.fullname}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
