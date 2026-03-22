"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Search, Download, Users, UserCog, GraduationCap } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface UserData {
  id: string;
  fullname: string;
  email: string;
  role: string;
  phoneNumber: string;
  createdAt: string;
}

export function AdminDashboardClient() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (users.length === 0) return;
    
    const headers = ["ID", "Name", "Email", "Role", "Phone", "Registration Date"];
    const csvContent = [
      headers.join(","),
      ...filteredUsers.map(u => [
        u.id,
        `"${u.fullname}"`,
        u.email,
        u.role,
        u.phoneNumber || "N/A",
        format(new Date(u.createdAt), "yyyy-MM-dd")
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `drona_users_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter((u) => 
    u.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleColors: Record<string, string> = {
    ADMIN: "bg-red-100 text-red-800",
    TUTOR: "bg-blue-100 text-blue-800",
    PARENT: "bg-green-100 text-green-800",
    STUDENT: "bg-purple-100 text-purple-800"
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
           <h2 className="text-3xl font-bold tracking-tight">Platform Users</h2>
           <p className="text-muted-foreground mt-1">Manage all registered accounts across Drona.</p>
        </div>
        <Button onClick={handleExportCSV} variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
           <div className="relative w-full max-w-sm">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input
               type="search"
               placeholder="Search by name or email..."
               className="pl-8"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-muted-foreground flex items-center justify-center">
               <span className="animate-spin mr-2 border-2 border-primary border-t-transparent rounded-full w-5 h-5"></span>
               Loading users...
            </div>
          ) : (
            <div className="border rounded-md overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 font-medium">{user.fullname}</td>
                        <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className={`font-semibold ${roleColors[user.role] || "bg-gray-100 text-gray-800"}`}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">{user.phoneNumber || "-"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{format(new Date(user.createdAt), "MMM d, yyyy")}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        No users found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
