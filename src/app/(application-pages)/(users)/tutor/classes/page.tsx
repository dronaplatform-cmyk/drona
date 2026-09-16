"use client";

import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { IconBook, IconCalendar, IconLoader2 } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { verifyClassAttendance } from "@/src/app/actions/class";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import Link from "next/link";

// ... existing imports

export default function TutorClassesPage() {
  const [classes, setClasses] = useState<any[]>([]); // Relaxed type for now to match dashboard
  const [isLoading, setIsLoading] = useState(true);

  // Interactive State
  const [viewClass, setViewClass] = useState<any | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get("/api/tutor/classes");
      setClasses(response.data);
    } catch (error) {
      toast.error("Failed to fetch classes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (classId: string) => {
    if (!verificationCode) {
      toast.error("Please enter a code");
      return;
    }

    const res = await verifyClassAttendance(classId, verificationCode);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Class Verified Successfully!");
      fetchClasses();
      setVerificationCode("");
      setSelectedClassId(null);
      // If viewing details, update that too if needed, or close it
      if (viewClass?.id === classId) setViewClass(null);
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
        <h1 className="text-3xl font-bold">My Classes</h1>
        <p className="text-muted-foreground">Manage your upcoming and past classes</p>
      </div>

      {classes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <IconBook className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No classes found</p>
            <p className="text-muted-foreground">Scheduled classes will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* {classes.filter((cls) => cls.status !== "COMPLETED").map((cls) => ( */}
          {/* {classes.map((cls) => ( */}
          {classes.map((cls) => {
            console.log(new Date(cls.scheduledAt).getDate() === new Date().getDate());

            return (
              <Link href={`/tutor/classes/${cls.id}`} key={cls.id}>

                <Card
                  key={cls.id}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                // onClick={() => setViewClass(cls)}
                >
                  <CardContent className="flex flex-col gap-4 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <IconCalendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Student: {cls.student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(cls.scheduledAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant={cls.status === "COMPLETED" ? "default" : cls.status === "CANCELLED" ? "destructive" : "secondary"}>
                        {cls.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Click for details</span>
                    </div>

                    {/* {cls.status === 'SCHEDULED' && (
                     <div className="flex items-center gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                        <Input 
                            placeholder="Code" 
                            className="w-24 h-8 text-xs"
                            maxLength={6}
                            value={selectedClassId === cls.id ? verificationCode : ""}
                            onChange={(e) => {
                                setSelectedClassId(cls.id);
                                setVerificationCode(e.target.value);
                            }}
                        />
                        <Button size="sm" className="h-8" onClick={() => handleVerify(cls.id)}>Verify</Button>
                     </div>
                )} */}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}

      {/* View Class Details Dialog */}
      <Dialog open={!!viewClass} onOpenChange={(open) => !open && setViewClass(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Class Details</DialogTitle>
            <DialogDescription>
              {viewClass?.student.name} <br />
              {viewClass && new Date(viewClass.scheduledAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <p className="font-medium">{viewClass?.status}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Details</Label>
                <p className="text-sm"> booked on {viewClass && new Date(viewClass.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg text-sm">
              <p><strong>Attendance Verification:</strong></p>
              <p className="text-muted-foreground">Enter the 6-digit code provided by the student to verify attendance.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewClass(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
