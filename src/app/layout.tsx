import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "NFR Bilgi & Güvenlik",
    description: "NFR Bilgi & Güvenlik",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>{children}</Providers>
                <Toaster
                    position="bottom-center"
                    toastOptions={{
                        duration: 4000,
                        className: "text-blue-400",
                    }}
                />
            </body>
        </html>
    );
}
