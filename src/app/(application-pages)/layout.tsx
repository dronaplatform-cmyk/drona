



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
import { LandingHeader } from "@/src/components/Headers";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { DynamicBreadcrumb } from "@/src/components/DynamicBreadcrumb";

export default function ApplicationLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { isStudentView, exitStudentView } = useProfile();
  const pathname = usePathname();

  // Exclude Auth pages from this layout structure
  if (pathname?.startsWith("/auth")) {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <IconLoader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <>
        <LandingHeader />
        {children}
      </>
    );
  }

  // Determine Navigation Items based on Role/View
  let navItems = parentNavItems;
  if (session?.user?.role === "STUDENT" || isStudentView) {
    navItems = studentNavItems;
  } else if (session?.user?.role === "TUTOR") {
    navItems = tutorNavItems;
  }

  return (
    <div className="min-h-screen bg-background font-application">
      {/* Desktop Sidebar */}
      <Sidebar items={navItems} />

      {/* Main Content Area */}
      <div className="lg:pl-64 pb-16 lg:pb-0">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b flex items-center justify-between bg-background sticky top-0 z-40">
          <span className="font-bold text-lg"><Link href={"/"}>Drona</Link></span>
          <div className="flex"> <ModeToggle />
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={`${session?.user?.image}`} />
                  <AvatarFallback>{session?.user?.name?.[0] || "*"}</AvatarFallback>
                </Avatar>

              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel> <div className="flex flex-col items-start gap-0.5">
                  <span className="text-sm font-medium">{session?.user?.name}</span>
                  <span className="text-xs font-medium text-muted-foreground">{session?.user?.role}</span>
                </div></DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                   <Button
                            variant="ghost"
                            className="w-full justify-start gap-3"
                            onClick={() => signOut({ callbackUrl: '/' })}
                          >
                            <IconLogout className="h-4 w-4" />
                            Logout
                          </Button>

                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu></div>
        </div>

        {/* Desktop Header / Top Bar */}
        <div className="hidden lg:flex h-16 items-center justify-end gap-4 border-b px-6">
          {/* <Badge variant="outline">


            <div className={cn(status === "authenticated" ? "bg-green-500" : "bg-red-500", "size-2 rounded-full ")} ></div>


           {session?.user?.role} | {status}</Badge> */}

          {isStudentView && (
            <Button
              onClick={exitStudentView}
              variant="destructive"
              size="sm"
            >
              Exit Student View
            </Button>
          )}
          <ModeToggle />


          <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={`${session?.user?.image}`} />
                <AvatarFallback>{session?.user?.name?.[0] || "*"}</AvatarFallback>
              </Avatar>

            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel> <div className="flex flex-col items-start gap-0.5">
                <span className="text-sm font-medium">{session?.user?.name}</span>
                <span className="text-xs font-medium text-muted-foreground">{session?.user?.role}</span>
              </div></DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                 <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <IconLogout className="h-4 w-4" />
          Logout
        </Button>

              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>


        </div>

        <main className="container mx-auto p-6">
          <DynamicBreadcrumb />
          {/* Mobile "Exit Student View" Button */}
          {isStudentView && (
            <div className="lg:hidden mb-4">
              <Button
                onClick={exitStudentView}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                Exit Student View
              </Button>
            </div>
          )}
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav items={navItems} />
    </div>
  );
}
