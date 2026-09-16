"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { IconLoader2, IconReportAnalytics, IconFileText } from "@tabler/icons-react";
import { toast } from "sonner";

interface Report {
  id: string;
  title: string;
  feedback: string;
  grade?: string;
  createdAt: string;
}

interface Student {
  id: string;
  name: string;
  reports: Report[];
}

export default function ParentReportsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get("/api/parent/reports");
      setStudents(response.data);
    } catch (error) {
      toast.error("Failed to fetch reports");
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

  if (students.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <IconReportAnalytics className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No students found</p>
            <p className="text-muted-foreground">Add students to view their reports.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Student Reports</h1>
        <p className="text-muted-foreground">View academic reports and feedback</p>
      </div>

      <Tabs defaultValue={students[0]?.id} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          {students.map((student) => (
            <TabsTrigger key={student.id} value={student.id}>
              {student.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {students.map((student) => (
          <TabsContent key={student.id} value={student.id} className="space-y-4 mt-6">
            {student.reports.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <IconFileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No reports available</p>
                  <p className="text-muted-foreground">Reports from tutors will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {student.reports.map((report) => (
                  <Card key={report.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{report.title}</CardTitle>
                          <CardDescription>
                            {new Date(report.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        {report.grade && (
                          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
                            {report.grade}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {report.feedback}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
