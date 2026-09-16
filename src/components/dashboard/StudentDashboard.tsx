"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { IconLoader2, IconBook, IconCalendar, IconQrcode, IconLink, IconFile } from "@tabler/icons-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { generateStudentClassCode } from "@/src/app/actions/student";

interface Resource {
  id: string;
  title: string;
  type: string;
  url: string | null;
}

interface ClassSession {
  id: string;
  scheduledAt: string;
  tutor: {
    user: {
      fullname: string;
    };
  };
  resources: Resource[];
}

interface Homework {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  isCompleted: boolean;
  class: {
    tutor: {
      user: {
        fullname: string;
      };
    };
  };
}

interface StudentData {
  student: {
    name: string;
    id: string; // Needed for server action
    age?: number;
    school?: string;
    aspirations?: string;
    interests?: string[];
  };
  homeworks: Homework[];
  classes: ClassSession[];
}



export default function StudentDashboard() {
  const [data, setData] = useState<StudentData | null>(null);
  const session = useSession();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    age: 0,
    school: '',
    aspirations: '',
    interests: [] as string[],
  });

  // Code Display State
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get("/api/student/dashboard");
      setData(response.data);
      if (response.data.student) {
        setProfileData({
          age: response.data.student.age || 0,
          school: response.data.student.school || '',
          aspirations: response.data.student.aspirations || '',
          interests: response.data.student.interests || [],
        });
      }
    } catch {
      toast.error("Failed to fetch student data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await axios.put('/api/student/profile', profileData);
      toast.success("Profile updated!");
      setIsEditing(false);
      fetchDashboard();
    } catch {
      toast.error("Failed to update profile");
    }
  };
  
  const handleShowCode = async (classId: string) => {
      if (!data?.student?.id) {
          toast.error("Student ID missing. Please refresh.");
          return;
      }
      
      const res = await generateStudentClassCode(classId, data.student.id);
      if (res.error) {
          toast.error(res.error);
      } else if (res.code) {
          setCurrentCode(res.code);
          setCodeDialogOpen(true);
      }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <IconLoader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-center p-8">Failed to load data.</p>;
  }

  return (
    <div className="space-y-8">
      {/* ... Welcome Section ... */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, {session.data?.user.name}! 👋
          </h2>
          <p className="text-muted-foreground">
            Here is your learning dashboard.
          </p>
        </div>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="outline">Edit Profile</Button>
          </DialogTrigger>
          <DialogContent>
             {/* ... Profile inputs ... */}
             <DialogHeader>
              <DialogTitle>Edit Your Profile</DialogTitle>
              <DialogDescription>Tell us more about yourself!</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Age</Label>
                <Input
                  type="number"
                  value={profileData.age}
                  onChange={(e) => setProfileData({ ...profileData, age: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>School</Label>
                <Input
                  value={profileData.school}
                  onChange={(e) => setProfileData({ ...profileData, school: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Aspirations</Label>
                <Textarea
                  value={profileData.aspirations}
                  onChange={(e) => setProfileData({ ...profileData, aspirations: e.target.value })}
                  placeholder="What do you want to be?"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateProfile}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCalendar className="h-5 w-5" />
              Upcoming Classes
            </CardTitle>
            <CardDescription>Your scheduled sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {data.classes.length === 0 ? (
              <p className="text-muted-foreground text-sm">No upcoming classes.</p>
            ) : (
              <div className="space-y-6">
                {data.classes.map((cls) => (
                  <div key={cls.id} className="rounded-lg border p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-lg">
                            {new Date(cls.scheduledAt).toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Tutor: {cls.tutor.user.fullname}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleShowCode(cls.id)}
                        >
                          <IconQrcode className="h-4 w-4 mr-2" />
                          Show Code
                        </Button>
                    </div>
                    
                    {/* Resources Section */}
                    {cls.resources && cls.resources.length > 0 && (
                        <div className="bg-muted/30 p-3 rounded-md">
                            <h5 className="text-xs font-semibold uppercase mb-2 text-muted-foreground">Resources</h5>
                            <div className="flex flex-col gap-2">
                                {cls.resources.map(res => (
                                    <div key={res.id} className="flex items-center gap-2 text-sm">
                                        {res.type === 'LINK' ? <IconLink className="w-3 h-3 text-blue-500"/> : <IconFile className="w-3 h-3 text-orange-500"/>}
                                        {res.url ? (
                                            <a href={res.url} target="_blank" rel="noreferrer" className="hover:underline text-primary">
                                                {res.title}
                                            </a>
                                        ) : (
                                            <span>{res.title}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Homework */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBook className="h-5 w-5" />
              Pending Homework
            </CardTitle>
            <CardDescription>Assignments to complete</CardDescription>
          </CardHeader>
          <CardContent>
            {data.homeworks.length === 0 ? (
              <p className="text-muted-foreground text-sm">No pending homework.</p>
            ) : (
              <div className="space-y-4">
                {data.homeworks.map((hw) => (
                  <div key={hw.id} className="rounded-lg border p-3">
                    <p className="font-medium">{hw.title}</p>
                    {hw.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {hw.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Due: {hw.dueDate ? new Date(hw.dueDate).toLocaleDateString() : "No due date"} • Tutor: {hw.class.tutor.user.fullname}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Code Display Dialog */}
      <Dialog open={codeDialogOpen} onOpenChange={setCodeDialogOpen}>
          <DialogContent className="sm:max-w-md">
              <DialogHeader>
                  <DialogTitle>Class Verification Code</DialogTitle>
                  <DialogDescription>Share this code with your tutor to start the class.</DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-center p-6">
                  <div className="text-4xl font-mono font-bold tracking-widest border-2 border-dashed p-4 rounded-lg bg-muted/50">
                      {currentCode}
                  </div>
              </div>
              <DialogFooter className="sm:justify-center">
                  <Button type="button" variant="secondary" onClick={() => setCodeDialogOpen(false)}>
                      Close
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
}
