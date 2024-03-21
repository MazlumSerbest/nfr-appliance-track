import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";

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
        <html lang="tr">
            <body className={inter.className}>
                <NextTopLoader
                    color="rgb(56 189 248)"
                    // showSpinner={false}
                    height={5}
                    easing="ease"
                />
                <Providers>{children}</Providers>
                <Toaster
                    position="bottom-center"
                    toastOptions={{
                        duration: 4000,
                        className: "text-sky-400",
                    }}
                />
            </body>
        </html>
    );
}
