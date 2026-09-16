"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { IconLoader2, IconArrowLeft, IconCalendar, IconFile, IconLink, IconUpload } from "@tabler/icons-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/src/components/ui/input-otp"
import { verifyClassAttendance, endClassSession } from "@/src/app/actions/class";
import { addResourceLink, uploadResourceFile } from "@/src/app/actions/resources";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";

export default function ClassDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState<any>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Resource Upload State
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false);
  const [resourceType, setResourceType] = useState("file");
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [resourceFile, setResourceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    fetchClassDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchClassDetails = async () => {
    try {
      const res = await axios.get(`/api/class/${id}`);
      setClassData(res.data);
    } catch (error) {
      toast.error("Failed to load class details");
    //   router.push("/tutor/classes"); // Redirect back on error
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
      if(!verificationCode) return toast.error("Enter a code");
      setVerifying(true);
      const res = await verifyClassAttendance(id, verificationCode);
      setVerifying(false);

      if(res.error) {
          toast.error(res.error);
      } else {
          toast.success("Class verified!");
          fetchClassDetails();
          setVerificationCode("");
      }
  };

  const handleEndClass = async () => {
    setEnding(true);
    const res = await endClassSession(id);
    setEnding(false);

    if (res.error) {
        toast.error(res.error);
    } else {
        toast.success("Class marked as completed!");
        fetchClassDetails();
    }
  };

    const handleResourceUpload = async () => {
        if (!resourceTitle) {
            toast.error("Please fill in title");
            return;
        }

        setUploading(true);
        // We know classData has tutorId from the fetch
        const tutorId = classData.tutorId;

        let res;
        if (resourceType === "link") {
            if (!resourceUrl) {
                setUploading(false);
                return toast.error("Please enter a URL");
            }
            res = await addResourceLink(id, tutorId, resourceTitle, resourceUrl);
        } else {
            if (!resourceFile) {
                setUploading(false);
                return toast.error("Please select a file");
            }
            const formData = new FormData();
            formData.append("file", resourceFile);
            formData.append("title", resourceTitle);
            
            // Note: Upload server action likely handles file processing
            res = await uploadResourceFile(id, tutorId, formData);
        }

        setUploading(false);

        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Resource added successfully!");
            setResourceDialogOpen(false);
            setResourceTitle("");
            setResourceUrl("");
            setResourceFile(null);
            fetchClassDetails(); 
        }
    };


  if (loading) {
    return <div className="flex h-screen items-center justify-center"><IconLoader2 className="animate-spin" /></div>;
  }

  if (!classData) return null;

  return (
    <div className="container py-8 max-w-4xl space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="gap-2">
        <IconArrowLeft className="w-4 h-4" /> Back
      </Button>

      <div className="flex justify-between items-start">
        <div>
            <h1 className="text-3xl font-bold">Class with {classData.student.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <IconCalendar className="w-4 h-4" />
                {new Date(classData.scheduledAt).toLocaleString()}
            </div>
        </div>
        <Badge variant={classData.status === "COMPLETED" ? "default" : classData.status === "CANCELLED" ? "destructive" : "secondary"} className="text-lg px-4 py-1">
            {classData.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
            {/* Verification Section */}
            {(classData.status === "SCHEDULED" || classData.status === "IN_PROGRESS") && (
                <Card>
                    <CardHeader>
                        <CardTitle>{classData.status === "SCHEDULED" ? "Attendance Verification" : "Class In Progress"}</CardTitle>
                        <CardDescription>
                            {classData.status === "SCHEDULED" 
                                ? "Enter the code provided by the student to start class." 
                                : "Class is currently active. End the session when done."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {classData.status === "SCHEDULED" ? (
                            <div className="flex gap-4 items-center">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground ml-1">Student Code</Label>
                                    <InputOTP 
                                        maxLength={6} 
                                        value={verificationCode} 
                                        onChange={(val) => setVerificationCode(val)}
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                                <Button onClick={handleVerify} disabled={verifying} className="mt-5">
                                    {verifying && <IconLoader2 className="mr-2 w-4 h-4 animate-spin"/>}
                                    Verify & Start
                                </Button>
                            </div>
                        ) : (
                             <Button onClick={handleEndClass} disabled={ending} variant="destructive" className="w-full md:w-auto">
                                {ending && <IconLoader2 className="mr-2 w-4 h-4 animate-spin"/>}
                                End Class Session
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Resources Section */}
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle>Class Resources</CardTitle>
                        <CardDescription>Shared materials for this session</CardDescription>
                    </div>
                    <Dialog open={resourceDialogOpen} onOpenChange={setResourceDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="outline"><IconUpload className="w-4 h-4 mr-2"/> Add Resource</Button>
                        </DialogTrigger>
                        <DialogContent>
                             <DialogHeader>
                                <DialogTitle>Upload Resource</DialogTitle>
                                <DialogDescription>Share a file or link.</DialogDescription>
                            </DialogHeader>
                            


                            <Tabs defaultValue="file" value={resourceType} onValueChange={setResourceType}>
                                <TabsList  >
                                    <TabsTrigger value="file">File Upload</TabsTrigger>
                                    <TabsTrigger value="link">Link</TabsTrigger>
                                </TabsList>

                               
                                    <TabsContent value="file">
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input placeholder="Resource Title" value={resourceTitle} onChange={e => setResourceTitle(e.target.value)} />
                                    </div>
                                         <div className="space-y-2">
                                            <Label>File</Label>
                                            <Input type="file" onChange={e => setResourceFile(e.target.files?.[0] || null)} />
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="link">
                                         <div className="space-y-2">
                                            <Label>URL</Label>
                                            <Input placeholder="https://..." value={resourceUrl} onChange={e => setResourceUrl(e.target.value)} />
                                        </div>
                                    </TabsContent>
                            </Tabs>
                            <DialogFooter>
                                <Button onClick={handleResourceUpload} disabled={uploading}>
                                    {uploading && <IconLoader2 className="mr-2 w-4 h-4 animate-spin" />}
                                    Upload
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {classData.resources.length === 0 ? (
                        <p className="text-muted-foreground text-sm py-4">No resources uploaded yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {classData.resources.map((res: any) => (
                                <div key={res.id} className="flex items-center justify-between p-3 border rounded-md">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-muted rounded-full">
                                            {res.type === 'LINK' ? <IconLink className="w-4 h-4"/> : <IconFile className="w-4 h-4"/>}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{res.title}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(res.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    {res.url && (
                                        <Button variant="ghost" size="sm" asChild>
                                            <a href={res.url} target="_blank" rel="noreferrer">Open</a>
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Student Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {classData.student.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-medium">{classData.student.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {classData.student.id}</p>
                        </div>
                    </div>
                    {classData.student.school && (
                         <div>
                            <Label className="text-xs text-muted-foreground">School</Label>
                            <p className="text-sm">{classData.student.school}</p>
                        </div>
                    )}
                     {classData.student.aspirations && (
                         <div>
                            <Label className="text-xs text-muted-foreground">Aspirations</Label>
                            <p className="text-sm text-muted-foreground italic">"{classData.student.aspirations}"</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
