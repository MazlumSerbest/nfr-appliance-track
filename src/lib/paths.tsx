import React from "react";
import {
    BiCollection,
    BiServer,
    BiLink,
    BiCog,
    BiGroup,
    BiUserCircle,
    BiDevices,
    BiBriefcase,
    BiStoreAlt,
    BiCheckShield,
    BiShield,
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
        path: "/dashboard/licenses",
        key: "licenses",
        name: "Lisanslar",
        icon: (
            <BiCheckShield
                className="text-2xl text-zinc-500"
                aria-label="Lisanslar Sayfası"
            />
        ),
    },
    {
        path: "/dashboard/connections",
        key: "connections",
        name: "Bağlantılar",
        isAdmin: true,
        icon: (
            <BiLink
                className="text-2xl text-zinc-500"
                aria-label="Bağlantılar Sayfası"
            />
        ),
    },
    // {
    //     path: "/dashboard/settings",
    //     key: "settings",
    //     name: "Ayarlar",
    //     icon: (
    //         <BiCog
    //             className="text-2xl text-zinc-500"
    //             aria-label="Ayarlar Sayfası"
    //         />
    //     ),
    // },
];

export const definitions: Path[] =[
    {
        path: "/dashboard/users",
        key: "users",
        name: "Kullanıcılar",
        isAdmin: true,
        icon: (
            <BiGroup
                className="text-2xl text-zinc-500"
                aria-label="Kullanıcılar Sayfası"
            />
        ),
    },
    {
        path: "/dashboard/products",
        key: "products",
        name: "Ürünler",
        icon: (
            <BiDevices
                className="text-2xl text-zinc-500"
                aria-label="Ürünler Sayfası"
            />
        ),
    },
    {
        path: "/dashboard/licenseTypes",
        key: "licenseTypes",
        name: "Lisans Tipleri",
        icon: (
            <BiShield
                className="text-2xl text-zinc-500"
                aria-label="Lisans Tipleri Sayfası"
            />
        ),
    },
    {
        path: "/dashboard/customers",
        key: "customers",
        name: "Müşteriler",
        icon: (
            <BiUserCircle
                className="text-2xl text-zinc-500"
                aria-label="Müşteriler Sayfası"
            />
        ),
    },
    {
        path: "/dashboard/dealers",
        key: "dearlers",
        name: "Bayiler",
        icon: (
            <BiBriefcase
                className="text-2xl text-zinc-500"
                aria-label="Bayiler Sayfası"
            />
        ),
    },
    {
        path: "/dashboard/suppliers",
        key: "suppliers",
        name: "Tedarikçiler",
        icon: (
            <BiStoreAlt
                className="text-2xl text-zinc-500"
                aria-label="Tedarikçiler Sayfası"
            />
        ),
    },
]
