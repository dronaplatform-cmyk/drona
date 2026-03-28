"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { IconSearch, IconMapPin, IconLoader2, IconArrowRight, IconFilter } from "@tabler/icons-react";
import Link from "next/link";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import { Masonry } from "@mui/lab";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/src/components/ui/sheet";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Label } from "@/src/components/ui/label";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/src/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { LOCATIONS } from "@/src/constants/locations";
import { SUBJECTS } from "@/src/constants/subjects";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface Tutor {
  id: string;
  hourlyRate: number;
  subjects: string[];
  location: string;
  bio: string;
  user: {
    fullname: string;
    phoneNumber: string;
    image: string | null;
    profileImage: string | null;
  };
}

const CLASS_RANGES = ['1-5', '6-8', '9-10', '11-12'];

export default function FindTutorPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);

  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");

  const fetchTutors = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("query", searchQuery);
      if (selectedSubjects.length > 0) params.append("subject", selectedSubjects.join(","));
      if (location) params.append("location", location);
      if (selectedClasses.length > 0) params.append("classesTaught", selectedClasses.join(","));
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (rating) params.append("rating", rating);

      const response = await axios.get(`/api/tutors?${params.toString()}`);
      setTutors(response.data);
    } catch (error) {
      console.error("Failed to fetch tutors", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedSubjects, location, selectedClasses, minPrice, maxPrice, rating]);

  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  const toggleClassSelection = (cls: string) => {
    setSelectedClasses(prev => 
      prev.includes(cls) ? prev.filter(c => c !== cls) : [...prev, cls]
    );
  };

  const clearFilters = () => {
    setLocation("");
    setSelectedClasses([]);
    setSelectedSubjects([]);
    setMinPrice("");
    setMaxPrice("");
    setRating("");
  };

  const toggleSubject = (subj: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subj) ? prev.filter(s => s !== subj) : [...prev, subj]
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold">Find a Tutor</h1>
           <p className="text-muted-foreground mt-1">Discover the best tutors for your needs</p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search name, bio..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchTutors()}
                />
            </div>
            <Button onClick={fetchTutors}>Search</Button>
            
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" className="gap-2">
                        <IconFilter className="w-4 h-4" />
                        Filters
                        {(location || selectedClasses.length > 0 || minPrice || maxPrice || rating) && (
                            <Badge variant="secondary" className="ml-1 px-1 h-5 min-w-5 flex items-center justify-center">
                                !
                            </Badge>
                        )}
                    </Button>
                </SheetTrigger>
                <SheetContent className="w-[350px] p-4 sm:w-[540px] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Filter Tutors</SheetTitle>
                        <SheetDescription>
                            Narrow down your search results.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-6">
                        {/* Subject Filter */}
                        <div className="space-y-2">
                            <Label>Subjects</Label>
                            <Popover open={subjectOpen} onOpenChange={setSubjectOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={subjectOpen}
                                        className="w-full justify-between"
                                    >
                                        {selectedSubjects.length > 0
                                            ? `${selectedSubjects.length} selected`
                                            : "Select subjects..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search subject..." />
                                        <CommandList>
                                            <CommandEmpty>No subject found.</CommandEmpty>
                                            <CommandGroup className="max-h-[200px] overflow-y-auto">
                                                {SUBJECTS.map((subj) => (
                                                    <CommandItem
                                                        key={subj}
                                                        value={subj}
                                                        onSelect={() => toggleSubject(subj)}
                                                    >
                                                        <div
                                                            className={cn(
                                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                                selectedSubjects.includes(subj)
                                                                    ? "bg-primary text-primary-foreground"
                                                                    : "opacity-50 [&_svg]:invisible"
                                                            )}
                                                        >
                                                            <Check className={cn("h-4 w-4")} />
                                                        </div>
                                                        {subj}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {selectedSubjects.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {selectedSubjects.map((subj) => (
                                        <Badge key={subj} variant="secondary" className="text-xs cursor-pointer" onClick={() => toggleSubject(subj)}>
                                            {subj}
                                            <span className="ml-1">×</span>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Separator />

                        {/* Location Filter */}
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={locationOpen}
                                        className="w-full justify-between"
                                    >
                                        {location
                                            ? LOCATIONS.find((loc) => loc === location) || location
                                            : "Select location..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search location..." />
                                        <CommandList>
                                            <CommandEmpty>No location found.</CommandEmpty>
                                            <CommandGroup>
                                                {LOCATIONS.map((loc) => (
                                                    <CommandItem
                                                        key={loc}
                                                        value={loc}
                                                        onSelect={(currentValue) => {
                                                            setLocation(currentValue === location ? "" : currentValue);
                                                            setLocationOpen(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                location === loc ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {loc}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <Separator />

                        {/* Class Range Filter */}
                        <div className="space-y-3">
                            <Label>Class Range</Label>
                            <div className="grid grid-cols-2 gap-4">
                                {CLASS_RANGES.map((cls) => (
                                    <div key={cls} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={`class-${cls}`} 
                                            checked={selectedClasses.includes(cls)}
                                            onCheckedChange={() => toggleClassSelection(cls)}
                                        />
                                        <Label htmlFor={`class-${cls}`} className="leading-none cursor-pointer">
                                            {cls}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Price Filter */}
                        <div className="space-y-3">
                            <Label>Hourly Rate (₹)</Label>
                            <div className="flex items-center gap-4">
                                <div className="grid gap-1.5 flex-1">
                                    <Label htmlFor="minPrice" className="text-xs text-muted-foreground">Min</Label>
                                    <Input 
                                        id="minPrice"
                                        type="number" 
                                        placeholder="0" 
                                        value={minPrice} 
                                        onChange={(e) => setMinPrice(e.target.value)} 
                                    />
                                </div>
                                <div className="grid gap-1.5 flex-1">
                                    <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">Max</Label>
                                    <Input 
                                        id="maxPrice"
                                        type="number" 
                                        placeholder="2000+" 
                                        value={maxPrice} 
                                        onChange={(e) => setMaxPrice(e.target.value)} 
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Rating Filter */}
                        <div className="space-y-3">
                             <Label>Minimum Rating</Label>
                             <select 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                            >
                                <option value="">Any</option>
                                <option value="4.5">4.5+ Stars</option>
                                <option value="4">4.0+ Stars</option>
                                <option value="3">3.0+ Stars</option>
                            </select>
                        </div>

                        <div className="pt-4 flex gap-2">
                            <Button className="flex-1" onClick={() => { fetchTutors(); }}>Apply Filters</Button>
                            <Button variant="outline" onClick={clearFilters}>Reset</Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center p-12">
           <IconLoader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : tutors.length === 0 ? (
        <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <IconSearch className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No tutors found</h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                We couldn&apos;t find any tutors matching your current filters. Try adjusting your search criteria.
            </p>
            <Button variant="link" onClick={clearFilters} className="mt-4">
                Clear all filters
            </Button>
        </div>
      ) : (
        <Masonry spacing={2} columns={{ xs: 1, sm: 2, lg: 3 }}>
            {tutors.map((tutor) => (
            <Link href={`/tutors/${tutor.id}`} key={tutor.id} className="block group">
                <Card className="h-full hover:shadow-lg transition-all duration-200 border-muted/60 hover:border-primary/20">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border">
                                <AvatarImage src={tutor.user.image || tutor.user.profileImage || undefined} alt={tutor.user.fullname} />
                                <AvatarFallback className="bg-primary/10 text-primary">{tutor.user.fullname.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                                    {tutor.user.fullname}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-1 mt-1 text-xs">
                                    <IconMapPin className="h-3 w-3" />
                                    {tutor.location || "Online"}
                                </CardDescription>
                            </div>
                        </div>
                        {tutor.hourlyRate ? (
                            <Badge variant="outline" className="text-sm font-semibold whitespace-nowrap bg-green-50 text-green-700 border-green-200">
                                ₹{tutor.hourlyRate}/hr
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="text-sm font-semibold whitespace-nowrap text-muted-foreground">
                                Rate not set
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-1.5 mb-3 min-h-[50px] content-start">
                    {tutor.subjects.slice(0, 4).map((subj) => (
                        <Badge variant="secondary" key={subj} className="text-xs bg-secondary/50 hover:bg-secondary">
                            {subj}
                        </Badge>
                    ))}
                    {tutor.subjects.length > 4 && (
                        <Badge variant="secondary" className="text-xs">+{tutor.subjects.length - 4}</Badge>
                    )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 h-10 mb-4">
                        {tutor.bio || "No bio available."}
                    </p>
                    
                    <Separator className="mb-4" />
                    
                    <div className="flex items-center justify-between text-sm font-medium text-primary">
                        <span>View Profile</span>
                        <IconArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                </CardContent>
                </Card>
            </Link>
            ))}
        </Masonry>
      )}
    </div>
  );
}
