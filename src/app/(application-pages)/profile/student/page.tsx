import StudentProfileForm from "@/src/components/profile/StudentProfileForm";
import { constructMetadata } from "@/src/lib/metadata";

export const metadata = constructMetadata({
  title: "Student Profile",
  description: "Manage your student profile."
});

export default function StudentProfilePage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your student profile.</p>
      </div>
      <StudentProfileForm />
    </div>
  );
}
