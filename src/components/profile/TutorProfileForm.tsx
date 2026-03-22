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
import { Textarea } from "@/src/components/ui/textarea";
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
import { Badge } from "@/src/components/ui/badge";
import { X, Check, ChevronsUpDown } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/src/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/src/components/ui/command";
import { cn } from "@/src/lib/utils";
import { SUBJECTS } from "@/src/constants/subjects";

const CLASSES_OPTIONS = [
    { label: "Class 1-5", value: "Class 1-5" },
    { label: "Class 6-8", value: "Class 6-8" },
    { label: "Class 9-10", value: "Class 9-10" },
    { label: "Class 11-12", value: "Class 11-12" },
    { label: "College Students", value: "College Students" },
    { label: "Competitive Exams", value: "Competitive Exams" },
    { label: "Others", value: "Others" },
];

const EXPERIENCE_OPTIONS = [
    { label: "< 1 year", value: "< 1 years" },
    { label: "2 years", value: "2" },
    { label: "3 years", value: "3" },
    { label: "4 years", value: "4" },
    { label: "More than 5 years", value: "more than 5" },
    { label: "Others", value: "others" },
];

const tutorProfileSchema = z.object({
  bio: z.string().optional(),
  subjects: z.array(z.string()).min(1, "At least one subject is required"),
  experience: z.string().optional(),
  experienceOthers: z.string().optional(),
  classesTaught: z.array(z.string()).optional(),
  hourlyRate: z.number().min(0, "Hourly rate must be positive"),
  location: z.string().optional(),
});

type TutorProfileFormValues = z.infer<typeof tutorProfileSchema>;

interface City {
    id: string;
    name: string;
    state: string;
}

export default function TutorProfileForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [subjectsOpen, setSubjectsOpen] = useState(false);
  const [classesOpen, setClassesOpen] = useState(false);
  const [cities, setCities] = useState<City[]>([]);

  const form = useForm<TutorProfileFormValues>({
    resolver: zodResolver(tutorProfileSchema),
    defaultValues: {
      bio: "",
      subjects: [],
      experience: "",
      experienceOthers: "",
      classesTaught: [],
      hourlyRate: 0,
      location: "",
    },
  });

  const { watch, setValue, reset, handleSubmit, control } = form;
  const selectedSubjects = watch('subjects') || [];
  const selectedClasses = watch('classesTaught') || [];

  const fetchCities = useCallback(async () => {
      try {
          const response = await axios.get('https://api.pujaka.com/v1/cities');
          if (response.data && response.data.data) {
              setCities(response.data.data);
          }
      } catch (error) {
          console.error("Failed to fetch cities", error);
      }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await axios.get("/api/tutors/profile");
      if (response.data && response.data.id) {
          const profile = response.data;
          
          let classesTaughtArr: string[] = [];
          if (profile.classesTaught) {
              classesTaughtArr = profile.classesTaught.split(',').map((s: string) => s.trim()).filter((s: string) => s !== "");
          }

          const isOthers = profile.experience && !EXPERIENCE_OPTIONS.find(opt => opt.value === profile.experience && opt.value !== 'others');
          
        reset({
          bio: profile.bio || "",
          subjects: profile.subjects || [],
          experience: isOthers ? "others" : (profile.experience || ""),
          experienceOthers: isOthers ? profile.experience : "",
          classesTaught: classesTaughtArr,
          hourlyRate: profile.hourlyRate || 0,
          location: profile.location || "",
        });
      }
    } catch {
      toast.error("Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    fetchProfile();
    fetchCities();
  }, [fetchProfile, fetchCities]);

  const onSubmit = async (data: TutorProfileFormValues) => {
    try {
      const experienceValue = data.experience === "others" ? data.experienceOthers : data.experience;
        
      await axios.post("/api/tutors/profile", {
        ...data,
        experience: experienceValue,
        classesTaught: data.classesTaught?.join(', '),
      });
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const toggleSubject = (subject: string) => {
      const current = selectedSubjects;
      if (current.includes(subject)) {
          setValue('subjects', current.filter(s => s !== subject));
      } else {
          setValue('subjects', [...current, subject]);
      }
  };

  const toggleClass = (cls: string) => {
      const current = selectedClasses;
      if (current.includes(cls)) {
          setValue('classesTaught', current.filter(c => c !== cls));
      } else {
          setValue('classesTaught', [...current, cls]);
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
        <CardTitle>Tutor Profile</CardTitle>
        <CardDescription>Update your public profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us about your teaching style and experience..." className="min-h-[120px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Subjects */}
                 <div className="space-y-2">
                    <Label>Subjects</Label>
                    <Popover open={subjectsOpen} onOpenChange={setSubjectsOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={subjectsOpen}
                                className="w-full justify-between"
                            >
                                {selectedSubjects.length > 0 
                                    ? `${selectedSubjects.length} subjects selected`
                                    : "Select subjects..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput placeholder="Search subjects..." />
                                <CommandList>
                                    <CommandEmpty>No subject found.</CommandEmpty>
                                    <CommandGroup>
                                        {SUBJECTS.map((subject) => (
                                            <CommandItem
                                                key={subject}
                                                onSelect={() => toggleSubject(subject)}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedSubjects.includes(subject) ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {subject}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {selectedSubjects.map((subject) => (
                            <Badge key={subject} variant="secondary" className="flex items-center gap-1">
                                {subject}
                                <X 
                                    className="h-3 w-3 cursor-pointer" 
                                    onClick={() => toggleSubject(subject)}
                                />
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Classes Taught */}
                <div className="space-y-2">
                    <Label>Classes Taught</Label>
                    <Popover open={classesOpen} onOpenChange={setClassesOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={classesOpen}
                                className="w-full justify-between"
                            >
                                {selectedClasses.length > 0 
                                    ? `${selectedClasses.length} levels selected`
                                    : "Select class levels..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput placeholder="Search class levels..." />
                                <CommandList>
                                    <CommandEmpty>No class level found.</CommandEmpty>
                                    <CommandGroup>
                                        {CLASSES_OPTIONS.map((opt) => (
                                            <CommandItem
                                                key={opt.value}
                                                onSelect={() => toggleClass(opt.value)}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedClasses.includes(opt.value) ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {opt.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {selectedClasses.map((cls) => (
                            <Badge key={cls} variant="secondary" className="flex items-center gap-1">
                                {cls}
                                <X 
                                    className="h-3 w-3 cursor-pointer" 
                                    onClick={() => toggleClass(cls)}
                                />
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Experience */}
                <FormField
                  control={control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teaching Experience</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {EXPERIENCE_OPTIONS.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watch('experience') === 'others' && (
                  <FormField
                    control={control}
                    name="experienceOthers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specify Experience</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 10+ years" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hourly Rate (₹)</FormLabel>
                      <FormControl>
                        <Input 
                            type="number" 
                            placeholder="500" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      {field.value > 0 && (
                          <div className="text-xs mt-2 text-green-600 flex items-center flex-wrap gap-2">
                              <span>Estimated Monthly Net Payout: ₹{Math.round((field.value * 30) * 0.97)}</span>
                              <a href="/terms" target="_blank" className="text-primary hover:underline ml-auto">
                                  View Commission Breakdown
                              </a>
                          </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <FormField
              control={control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (City)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[200px]">
                        {cities.length === 0 && <SelectItem value="loading" disabled>Loading cities...</SelectItem>}
                        {cities.map((city) => (
                            <SelectItem key={city.id} value={city.name}>
                                {city.name}, {city.state}
                            </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
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

// Helper Label component if not imported
function Label({ children, className }: { children: React.ReactNode, className?: string }) {
    return <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}>{children}</label>
}
