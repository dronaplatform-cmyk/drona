"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ProfileContextType {
  isStudentView: boolean;
  activeStudentId: string | null;
  switchToStudent: (studentId: string) => void;
  exitStudentView: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { data: session, update } = useSession();
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);
  const router = useRouter();

  // Sync local state with session
  useEffect(() => {
    if (session?.user?.activeStudentId) {
      setActiveStudentId(session.user.activeStudentId);
    } else {
      setActiveStudentId(null);
    }
  }, [session]);

  const switchToStudent = async (studentId: string) => {
    // 1. Update Session via NextAuth (triggers jwt callback)
    await update({ activeStudentId: studentId });
    setActiveStudentId(studentId);
    router.refresh();
    router.push("/dashboard"); // Redirect to dashboard which will now show student view
  };

  const exitStudentView = async () => {
    // 1. Clear Session
    await update({ activeStudentId: null });
    setActiveStudentId(null);
    router.refresh();
    router.push("/dashboard");
  };

  return (
    <ProfileContext.Provider
      value={{
        isStudentView: !!activeStudentId,
        activeStudentId,
        switchToStudent,
        exitStudentView,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
