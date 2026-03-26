"use client";

import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useProfile } from "@/src/providers/ProfileProvider";
import { IconLoader2, IconUserPlus, IconUsers, IconCalendarPlus, IconSearch } from "@tabler/icons-react";
import { toast } from "sonner";
import { bookClass, searchTutors } from "@/src/app/actions/booking";
import { useSession } from "next-auth/react";
import { OnboardingModal } from "@/src/components/dashboard/OnboardingModal";

const createStudentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

type CreateStudentForm = z.infer<typeof createStudentSchema>;

interface Student {
  id: string;
  name: string;
  studentId: string;
}

interface Tutor {
  id: string;
  hourlyRate: number;
  subjects: string[];
  user: {
    fullname: string;
  };
}

import { Switch } from "@/src/components/ui/switch";
import { Slider } from "@/src/components/ui/slider";

// ... existing imports

export default function ParentDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { switchToStudent } = useProfile();
  const session = useSession();

  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tutorResults, setTutorResults] = useState<Tutor[]>([]);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [bookingDate, setBookingDate] = useState("");

  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringWeeks, setRecurringWeeks] = useState(1);

  const form = useForm<CreateStudentForm>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      name: "",
      password: "",
    },
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("/api/parent/students");
      setStudents(response.data);
    } catch (error) {
      toast.error("Failed to fetch students");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CreateStudentForm) => {
    try {
      await axios.post("/api/parent/students", data);
      toast.success("Student created successfully");
      form.reset();
      fetchStudents();
    } catch (error) {
      toast.error("Failed to create student");
    }
  };

  const handleTutorSearch = async () => {
    const res = await searchTutors(searchQuery);
    if (res.tutors) {
      // @ts-ignore
      setTutorResults(res.tutors as unknown as Tutor[]);
    }
  };
  
  const openBooking = (studentId: string) => {
    setSelectedStudentId(studentId);
    setBookingDialogOpen(true);
  };

  const handleBookClass = async () => {
    if (!selectedStudentId || !selectedTutor || !bookingDate || !session.data?.user.id) return;

    try {
        const start = new Date(bookingDate);
        const schedules = [];

        if (isRecurring) {
            for (let i = 0; i < recurringWeeks; i++) {
                const date = new Date(start);
                date.setDate(start.getDate() + (i * 7));
                schedules.push(date.toISOString());
            }
        } else {
            schedules.push(start.toISOString());
        }

        await axios.post('/api/class/create', {
            tutorId: selectedTutor.id,
            studentId: selectedStudentId,
            schedules: schedules
        });

      toast.success(isRecurring ? `${schedules.length} classes booked successfully!` : "Class booked successfully!");
      setBookingDialogOpen(false);
      setSelectedTutor(null);
      setBookingDate("");
      setSearchQuery("");
      setTutorResults([]);
      setIsRecurring(false);
      setRecurringWeeks(1);
    } catch (e) {
      toast.error("Booking failed");
    }
  };

  // ... openBooking, etc.

  return (
    <div className="space-y-8">
      <OnboardingModal userRole="PARENT" />
      {/* ... Add Student & List Cards (unchanged) ... */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Add Student Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUserPlus className="h-5 w-5" />
              Add Student
            </CardTitle>
            <CardDescription>Create a profile for your child</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name of your child" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="****" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && (
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Profile
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Student List */}
        <Card className="md:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUsers className="h-5 w-5" />
              Your Children
            </CardTitle>
            <CardDescription>Manage profiles and switch views</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-4">
                <IconLoader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : students.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No students added yet.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex flex-col justify-between rounded-lg border p-4 gap-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {student.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => switchToStudent(student.id)}
                      >
                        Switch View
                      </Button>
                      {/* <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => openBooking(student.id)}
                      >
                        <IconCalendarPlus className="w-4 h-4 mr-2" />
                        Book Class
                      </Button> */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Book a Class</DialogTitle>
            <DialogDescription>Find a tutor and schedule a session.</DialogDescription>
          </DialogHeader>

          {!selectedTutor ? (
            <div className="space-y-4 py-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search by name or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button size="icon" onClick={handleTutorSearch}>
                  <IconSearch className="h-4 w-4" />
                </Button>
              </div>

              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {tutorResults.map(tutor => (
                  <div key={tutor.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedTutor(tutor)}>
                    <div>
                      <p className="font-medium">{tutor.user.fullname}</p>
                      <p className="text-xs text-muted-foreground">{tutor.subjects.join(", ")}</p>
                    </div>
                    <Button size="sm" variant="ghost">Select</Button>
                  </div>
                ))}
                {tutorResults.length === 0 && searchQuery && (
                  <p className="text-center text-sm text-muted-foreground py-4">No tutors found.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-md border">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Tutor</span>
                    <span className="font-medium">{selectedTutor.user.fullname}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTutor(null)}>Change</Button>
              </div>

              <div className="space-y-4 border p-4 rounded-md">
                <div className="space-y-2">
                    <FormLabel>Start Date & Time</FormLabel>
                    <Input
                    type="datetime-local"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    />
                </div>

                <div className="flex items-center justify-between space-x-2">
                    <FormLabel className="flex flex-col space-y-1">
                        <span>Recurring Booking</span>
                        <span className="font-normal text-xs text-muted-foreground">Repeat this slot weekly?</span>
                    </FormLabel>
                    <Switch
                        checked={isRecurring}
                        onCheckedChange={setIsRecurring}
                    />
                </div>

                {isRecurring && (
                    <div className="space-y-4 pt-2">
                        <div className="flex justify-between">
                            <FormLabel>Duration</FormLabel>
                            <span className="text-sm text-muted-foreground">{recurringWeeks} Weeks</span>
                        </div>
                        <Slider
                            value={[recurringWeeks]}
                            onValueChange={(vals) => setRecurringWeeks(vals[0])}
                            min={2}
                            max={12}
                            step={1}
                        />
                         <p className="text-xs text-muted-foreground">
                            Class will be scheduled every {bookingDate && new Date(bookingDate).toLocaleDateString("en-US", { weekday: 'long' })} at {bookingDate && new Date(bookingDate).toLocaleTimeString("en-US", { hour: '2-digit', minute:'2-digit' })}.
                        </p>
                    </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            {selectedTutor && (
              <Button onClick={handleBookClass}>
                  {isRecurring ? `Confirm ${recurringWeeks} Sessions` : "Confirm Booking"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
