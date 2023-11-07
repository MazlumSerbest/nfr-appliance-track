import React from "react";
import {
    BiCollection,
    BiServer,
    BiLink,
    BiCog,
} from "react-icons/bi";

export const paths: Path[] = [
    {
        path: "/dashboard",
        key: "dashboard",
        name: "Panel",
        icon: (
            <BiCollection
                className="text-2xl text-zinc-500"
                aria-label="Panel Sayfası"
            />
        ),
    },
    {
        path: "/dashboard/appliances",
        key: "appliances",
        name: "Cihazlar",
        icon: (
            <BiServer
                className="text-2xl text-zinc-500"
                aria-label="Cihazlar Sayfası"
            />
        ),
    },
    {
        path: "/dashboard/connections",
        key: "connections",
        name: "Bağlantılar",
        icon: (
            <BiLink
                className="text-2xl text-zinc-500"
                aria-label="Bağlantılar Sayfası"
            />
        ),
    },
    {
        path: "/dashboard/settings",
        key: "settings",
        name: "Ayarlar",
        icon: (
            <BiCog
                className="text-2xl text-zinc-500"
                aria-label="Ayarlar Sayfası"
            />
        ),
    },
];
