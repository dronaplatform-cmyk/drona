"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { NavItem } from "@/src/config/navigation";

interface BottomNavProps {
  items: NavItem[];
}

export function BottomNav({ items }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 w-full h-16 bg-background border-t lg:hidden">
      <div className="grid h-full grid-cols-5 mx-auto max-w-md">
        {items.slice(0, 5).map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-5 hover:bg-muted/50 group gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
              <span className="text-[10px] font-medium truncate max-w-[60px]">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
