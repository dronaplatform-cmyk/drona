import UserProfileForm from "@/src/components/profile/UserProfileForm";
import { constructMetadata } from "@/src/lib/metadata";

export const metadata = constructMetadata({
  title: "Parent Profile",
  description: "Manage your account information."
});

export default function ParentProfilePage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your account information.</p>
      </div>
      <UserProfileForm />
    </div>
  );
}
