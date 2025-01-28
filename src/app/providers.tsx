"use client";
import { HeroUIProvider } from "@heroui/react";
import { SWRConfig } from "swr";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SWRConfig
            value={{
                // refreshInterval: 3000,
                fetcher: (url) => fetch(url).then((res) => res.json()),
            }}
        >
            <HeroUIProvider locale="tr-TR">{children}</HeroUIProvider>
        </SWRConfig>
    );
}
