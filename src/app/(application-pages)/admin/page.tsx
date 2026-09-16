import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { AdminDashboardClient } from "@/src/components/admin/AdminDashboardClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Drona",
  description: "Manage users and platform data.",
};

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <AdminDashboardClient />
    </div>
  );
}
