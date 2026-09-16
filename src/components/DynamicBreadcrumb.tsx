"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import { resolveEntityName } from "@/src/app/actions/breadcrumbs";
import { Skeleton } from "@/src/components/ui/skeleton";

// Helper to check if a segment looks like a CUID or UUID
const isId = (segment: string) => {
  // CUID usually starts with 'c' then 20-30 chars
  // UUID 8-4-4-4-12
  const cuidRegex = /^c[a-z0-9]{20,30}$/;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  // Also check for our generated cuid length which is usually 25 chars
  return cuidRegex.test(segment) || uuidRegex.test(segment) || segment.length >= 20;
};

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const [segments, setSegments] = useState<{ path: string; label: string; isLast: boolean }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function resolveBreadcrumbs() {
      setLoading(true);
      const rawSegments = pathname ? pathname.split("/").filter(Boolean) : [];
      const resolvedSegments = [];
      let currentPath = "";

      for (let i = 0; i < rawSegments.length; i++) {
        const seg = rawSegments[i];
        currentPath += `/${seg}`;
        let label = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");

        // If it looks like an ID, try to resolve it
        if (isId(seg)) {
          const resolvedName = await resolveEntityName(seg);
          if (resolvedName) {
            label = resolvedName;
          }
        }

        resolvedSegments.push({
          path: currentPath,
          label: label,
          isLast: i === rawSegments.length - 1,
        });
      }

      setSegments(resolvedSegments);
      setLoading(false);
    }

    resolveBreadcrumbs();
  }, [pathname]);

  if (!pathname || pathname === "/") return null;

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {loading ? (
           <>
             <BreadcrumbSeparator />
             <BreadcrumbItem>
               <Skeleton className="w-20 h-4" />
             </BreadcrumbItem>
           </>
        ) : (
          segments.map((seg, index) => (
            <div key={seg.path} className="inline-flex items-center gap-1.5">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {seg.isLast ? (
                  <BreadcrumbPage>{seg.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={seg.path}>{seg.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
