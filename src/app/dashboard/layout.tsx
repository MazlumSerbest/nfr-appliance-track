"use client";
import NavLayout from "@/components/navigation/NavLayout";
import { SessionProvider } from "next-auth/react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider>
            <main className="flex min-h-screen">
                <NavLayout />
                <main className="flex-1 flex flex-col min-w-0 h-screen gap-2 overflow-auto p-2 pb-4 pt-14 lg:p-4 lg:pt-4">
                    {children}
                </main>
            </main>
        </SessionProvider>
    );
}
