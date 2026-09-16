
"use client";
import { Badge } from "@/src/components/ui/badge"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { NavItem } from "@/src/config/navigation";
import { Button } from "@/src/components/ui/button";
import { IconLogout } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";

interface SidebarProps {
  items: NavItem[];
}

export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();
  const session = useSession();
  console.log(session);

  return (
    <div className="hidden lg:flex h-screen w-64 flex-col fixed left-0 top-0 border-r bg-background">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tighter">Drona</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          {items.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary-400",
                  isActive ? "bg-primary/20 text-primary-400" : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
      <Badge className=" m-2" variant="outline"><div className={cn(session?.status === "authenticated" ? "bg-green-500" : "bg-red-500", "size-2  rounded-full ")} ></div>          {session?.data?.user?.role} | {session?.status}</Badge>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={() => signOut({ callbackUrl: '/' })}
        >

          <IconLogout className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
