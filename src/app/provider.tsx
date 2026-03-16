"use client"
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "../components/theme-provider";
import { ProfileProvider } from "../providers/ProfileProvider";

export function Providers({ children, session }: { children: React.ReactNode, session?: any }) {
    return (
        <SessionProvider session={session}>
            <ProfileProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"

                >
                    {children}
                </ThemeProvider>
            </ProfileProvider>
        </SessionProvider>
    );
}