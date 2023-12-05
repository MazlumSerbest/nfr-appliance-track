"use client";
import { NextUIProvider } from "@nextui-org/react";
import { SWRConfig } from "swr";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SWRConfig
            value={{
                // refreshInterval: 3000,
                fetcher: (url) => fetch(url).then((res) => res.json()),
            }}
        >
            <NextUIProvider>{children}</NextUIProvider>
        </SWRConfig>
    );
}
