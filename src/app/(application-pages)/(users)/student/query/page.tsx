"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { IconLoader2, IconMessage, IconUser, IconPlus } from "@tabler/icons-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/src/components/ui/sheet";

interface QueryResponse {
  id: string;
  content: string;
  senderRole: "TUTOR" | "PARENT" | "STUDENT";
  createdAt: string;
}

interface Query {
  id: string;
  content: string;
  senderRole: "TUTOR" | "PARENT" | "STUDENT";
  context: "TUTOR_PARENT" | "TUTOR_STUDENT";
  createdAt: string;
  tutor?: { user: { fullname: string } };
  responses: QueryResponse[];
}

import { usePageTitle } from "@/src/hooks/usePageTitle";

export default function StudentQueryPage() {
  usePageTitle("Queries");
  const [queries, setQueries] = useState<Query[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [newQueryContent, setNewQueryContent] = useState("");
  const [tutorId, setTutorId] = useState("");
  const [tutors, setTutors] = useState<any[]>([]);

  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    fetchQueries();
  }, []);

  useEffect(() => {
    if (isCreateOpen) {
      fetchTutors();
    }
  }, [isCreateOpen]);

  const fetchTutors = async () => {
    try {
      const response = await axios.get("/api/queries/recipients?context=TUTOR_STUDENT");
      setTutors(response.data);
    } catch (error) {
      console.error("Failed to fetch tutors");
    }
  };

  const fetchQueries = async () => {
    try {
      const response = await axios.get("/api/queries");
      setQueries(response.data);
    } catch (error) {
      toast.error("Failed to fetch queries");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateQuery = async () => {
    if (!tutorId || !newQueryContent) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await axios.post("/api/queries", {
        content: newQueryContent,
        context: "TUTOR_STUDENT",
        tutorId: tutorId,
      });
      toast.success("Query sent!");
      setIsCreateOpen(false);
      setNewQueryContent("");
      setTutorId("");
      fetchQueries();
    } catch (error) {
      toast.error("Failed to send query");
    }
  };

  const handleReply = async () => {
    if (!selectedQuery || !replyContent) return;

    try {
      await axios.post("/api/queries/response", {
        queryId: selectedQuery.id,
        content: replyContent,
      });
      toast.success("Reply sent!");
      setReplyContent("");

      const response = await axios.get("/api/queries");
      setQueries(response.data);

      const updatedQuery = response.data.find((q: Query) => q.id === selectedQuery.id);
      if (updatedQuery) setSelectedQuery(updatedQuery);

    } catch (error) {
      toast.error("Failed to send reply");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Queries</h1>
          <p className="text-muted-foreground">Ask your tutors for help</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <IconPlus className="mr-2 h-4 w-4" />
              New Query
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ask a Tutor</DialogTitle>
              <DialogDescription>Send a message to a tutor.</DialogDescription>
            </DialogHeader>
            <form className="space-y-4 py-4" onSubmit={(e) => { e.preventDefault(); handleCreateQuery(); }}>
              <div className="space-y-2">
                <Label>Tutor</Label>
                <Select
                  value={tutorId}
                  onValueChange={setTutorId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tutor" />
                  </SelectTrigger>
                  <SelectContent>
                    {tutors.map((tutor) => (
                      <SelectItem key={tutor.id} value={tutor.id}>
                        {tutor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  required
                  placeholder="Type your message here..."
                  value={newQueryContent}
                  onChange={(e) => setNewQueryContent(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full">Send Query</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <IconLoader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : queries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <IconMessage className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No queries yet</p>
            <p className="text-muted-foreground">Start a conversation with a tutor.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {queries.map((query) => (
            <Card key={query.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setSelectedQuery(query)}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <IconUser className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-base">
                        {query.senderRole === "STUDENT" ? "You" : query.tutor?.user.fullname}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {new Date(query.createdAt).toLocaleString()}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-xs font-medium px-2 py-1 rounded-full bg-secondary">
                    {query.senderRole}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-2">{query.content}</p>
                {query.responses.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {query.responses.length} repl{query.responses.length === 1 ? "y" : "ies"}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Sheet open={!!selectedQuery} onOpenChange={(open) => !open && setSelectedQuery(null)}>
        <SheetContent className="w-[400px] sm:w-[540px] flex flex-col h-full">
          <SheetHeader>
            <SheetTitle>Conversation</SheetTitle>
            <SheetDescription>
              With {selectedQuery?.tutor?.user.fullname}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedQuery && (
              <>
                <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {selectedQuery.senderRole === "STUDENT" ? "You" : selectedQuery.tutor?.user.fullname}
                    </span>
                    <span>{new Date(selectedQuery.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm">{selectedQuery.content}</p>
                </div>

                {selectedQuery.responses.map((response) => (
                  <div key={response.id} className={`flex flex-col gap-1 p-3 rounded-lg ${response.senderRole === "STUDENT" ? "bg-primary/10 ml-8" : "bg-muted/50 mr-8"}`}>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {response.senderRole === "STUDENT" ? "You" : selectedQuery.tutor?.user.fullname}
                      </span>
                      <span>{new Date(response.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm">{response.content}</p>
                  </div>
                ))}
              </>
            )}
          </div>

          <SheetFooter className="pt-4 border-t">
            <form className="w-full space-y-2" onSubmit={(e) => { e.preventDefault(); handleReply(); }}>
              <Textarea
                required
                placeholder="Type your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[80px]"
              />
              <Button type="submit" className="w-full">Reply</Button>
            </form>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
