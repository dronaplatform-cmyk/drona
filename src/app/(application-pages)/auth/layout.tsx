



"use client";
import { Badge } from "@/src/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { signOut, useSession } from "next-auth/react";
import { useProfile } from "@/src/providers/ProfileProvider";
import { IconLoader2, IconLogout } from "@tabler/icons-react";
import { Sidebar } from "@/src/components/Sidebar";
import { BottomNav } from "@/src/components/BottomNav";
import { parentNavItems, tutorNavItems, studentNavItems } from "@/src/config/navigation";
import { Button } from "@/src/components/ui/button";
import { ModeToggle } from "@/src/components/mode-toggle";
import { AuthenticationPageHeader, LandingHeader } from "@/src/components/Headers";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { DynamicBreadcrumb } from "@/src/components/DynamicBreadcrumb";
import { LandingFooter } from "@/src/components/Footers";

export default function AuthenticationLayout({ children }: { children: React.ReactNode }) {
  

 

  
  return (
   <main>
   <AuthenticationPageHeader />
        {children}
        
   <LandingFooter />
        </main>
  )
}
