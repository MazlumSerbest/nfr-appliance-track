import React from "react";
import {
    BiCollection,
    BiServer,
    BiLink,
    BiGroup,
    BiUserCircle,
    BiDevices,
    BiBriefcase,
    BiStoreAlt,
    BiCheckShield,
    BiShield,
    BiBarcode,
    BiRegistered,
    BiHdd,
} from "react-icons/bi";

export const paths: Path[] = [
    {
        path: "/dashboard",
        key: "dashboard",
        name: "Panel",
        roles: ["admin", "technical", "seller"],
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
        roles: ["admin", "technical", "seller"],
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
        roles: ["admin", "technical", "seller"],
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
        roles: ["admin", "technical"],
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

export const currents: Path[] = [
    {
        path: "/dashboard/customers",
        key: "customers",
        name: "Müşteriler",
        roles: ["admin", "technical", "seller"],
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
        roles: ["admin", "technical", "seller"],
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
        roles: ["admin", "technical", "seller"],
        icon: (
            <BiStoreAlt
                className="text-2xl text-zinc-500"
                aria-label="Tedarikçiler Sayfası"
            />
        ),
    },
];

export const definitions: Path[] = [
    {
        path: "/dashboard/users",
        key: "users",
        name: "Kullanıcılar",
        roles: ["admin"],
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
        roles: ["admin", "technical", "seller"],
        icon: (
            <BiHdd
                className="text-2xl text-zinc-500"
                aria-label="Ürünler Sayfası"
            />
        ),
    },
    {
        path: "/dashboard/brands",
        key: "brands",
        name: "Markalar",
        roles: ["admin", "technical", "seller"],
        icon: (
            <BiRegistered
                className="text-2xl text-zinc-500"
                aria-label="Markalar Sayfası"
            />
        ),
    },
    {
        path: "/dashboard/productTypes",
        key: "productTypes",
        name: "Ürün Tipleri",
        roles: ["admin", "technical", "seller"],
        icon: (
            <BiDevices
                className="text-2xl text-zinc-500"
                aria-label="Ürün Tipleri Sayfası"
            />
        ),
    },
    {
        path: "/dashboard/licenseTypes",
        key: "licenseTypes",
        name: "Lisans Tipleri",
        roles: ["admin", "technical", "seller"],
        icon: (
            <BiShield
                className="text-2xl text-zinc-500"
                aria-label="Lisans Tipleri Sayfası"
            />
        ),
    },
    {
        path: "/dashboard/boughtTypes",
        key: "boughtTypes",
        name: "Alım Tipleri",
        roles: ["admin", "technical", "seller"],
        icon: (
            <BiBarcode
                className="text-2xl text-zinc-500"
                aria-label="Alım Tipleri Sayfası"
            />
        ),
    },
];
