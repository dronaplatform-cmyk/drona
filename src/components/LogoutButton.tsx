"use client"
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
const LogoutButton = () => {
    const router = useRouter();
    const handleLogout = () => {

        signOut();
    }
    return (
        <Button onClick={handleLogout}>Logout</Button>
        // <Button onClick={() => signOut()}>Logout</Button>
    )
}

export default LogoutButton