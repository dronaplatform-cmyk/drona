"use client";

import { useSession } from "next-auth/react";
import { useProfile } from "@/src/providers/ProfileProvider";
import StudentDashboard from "@/src/components/dashboard/StudentDashboard";
import ParentDashboard from "@/src/components/dashboard/ParentDashboard";
import TutorDashboard from "@/src/components/dashboard/TutorDashboard";
import { IconLoader2 } from "@tabler/icons-react";


import { usePageTitle } from "@/src/hooks/usePageTitle";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { isStudentView } = useProfile();

  const title = (isStudentView || session?.user?.role === "STUDENT") ? "Student Dashboard" :
                session?.user?.role === "PARENT" ? "Parent Dashboard" :
                session?.user?.role === "TUTOR" ? "Tutor Dashboard" : "Dashboard";
  
  usePageTitle(title);

  console.log(session, session?.user?.role);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <IconLoader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  return (
    <>
   
          {isStudentView ||  session?.user?.role === "STUDENT"  ? (
            <StudentDashboard />
          ) : session?.user?.role === "PARENT" ? (
            <ParentDashboard />
          ) : session?.user?.role === "TUTOR"  ? (
            <TutorDashboard />
          ) : (
            <div>
              <p>{session?.user?.role} Role not recognized or User Dashboard</p>
            </div>
          )}
    </>
  );
}
