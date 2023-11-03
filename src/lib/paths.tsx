import React from "react";
import {
    BiCollection,
    BiBuildingHouse,
    BiShieldQuarter,
    BiError,
    BiSlider,
    BiCog,
} from "react-icons/bi";

export const paths: Path[] = [
    {
        path: "/dashboard",
        key: "dashboard",
        name: "Dashboard",
        icon: (
            <BiCollection
                className="text-2xl text-zinc-500"
                aria-label="Dashboard"
            />
        ),
    },
    {
        path: "/dashboard/settings",
        key: "settings",
        name: "Settings",
        icon: (
            <BiCog
                className="text-2xl text-zinc-500"
                aria-label="Settings Page"
            />
        ),
    },
];
