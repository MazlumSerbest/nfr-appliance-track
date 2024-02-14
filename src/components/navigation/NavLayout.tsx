"use client";
import { useState, useRef } from "react";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import useUserStore from "@/store/user";

import { useOnClickOutside } from "usehooks-ts";

import UserCard from "./UserCard";
import Logo from "./Logo";
import { paths, currents, definitions } from "@/lib/paths";

import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Listbox, ListboxSection, ListboxItem } from "@nextui-org/listbox";

import { BiMenu } from "react-icons/bi";

export default function NavLayout() {
    const [showSidebar, setShowSidebar] = useState(false);
    const { user } = useUserStore();

    // const t = useTranslations("General.Pages");

    const pathName = usePathname();
    let withoutFullLink = pathName.substring(pathName.indexOf("/panel"));

    const ref = useRef(null);
    useOnClickOutside(ref, (_) => {
        setShowSidebar(false);
    });

    return (
        <>
            {/* Navbar */}
            <nav className="flex md:hidden bg-white shadow z-[47] items-center fixed top-0 w-screen h-min py-2 px-4 gap-2">
                <Button
                    isIconOnly
                    variant="light"
                    onClick={() => setShowSidebar(true)}
                    onTouchEnd={() => setShowSidebar(true)}
                >
                    <BiMenu className="text-2xl text-zinc-500" />
                </Button>
                <span className="flex-1" />
                <Logo width={109} height={30} />
            </nav>
            {/* Sidebar */}
            <div
                ref={ref}
                className={
                    "fixed md:sticky flex flex-col z-[48] shrink-0 bg-white shadow-lg md:w-50 lg:w-64 h-screen t-0 p-3 py-5 gap-3 border-r border-slate-200 transition-transform .3s ease-in-out md:translate-x-0" +
                    (!showSidebar ? " -translate-x-full" : "")
                }
            >
                <Logo width={181} height={60} />
                <Divider />
                <div className="flex flex-col flex-grow overflow-x-hidden overflow-y-auto min-h-0">
                    <Listbox
                        variant="bordered"
                        // color="primary"
                        className="gap-1 text-md text-zinc-600"
                        aria-label="Menu listbox"
                    >
                        <ListboxSection showDivider>
                            {paths
                                .filter((p) =>
                                    p.roles?.includes(user?.role ?? ""),
                                )
                                .map((p) => (
                                    <ListboxItem
                                        key={p.key}
                                        startContent={p.icon}
                                        className={
                                            "font-semibold" +
                                            (withoutFullLink == p.path
                                                ? " bg-sky-100"
                                                : "")
                                        }
                                    >
                                        <NextLink
                                            className="absolute inset-0 outline-none"
                                            href={p.path}
                                            onClick={() =>
                                                setShowSidebar(false)
                                            }
                                            onTouchEnd={() =>
                                                setShowSidebar(false)
                                            }
                                        />
                                        {p.name}
                                    </ListboxItem>
                                ))}
                        </ListboxSection>
                        <ListboxSection
                            showDivider
                            title="Cariler"
                            classNames={{
                                heading: "text-zinc-500",
                            }}
                        >
                            {currents.filter((p) =>
                                    p.roles?.includes(user?.role ?? ""),
                                )
                                .map((p) => {
                                    return (
                                        <ListboxItem
                                            key={p.key}
                                            startContent={p.icon}
                                            className={
                                                "font-semibold" +
                                                (withoutFullLink == p.path
                                                    ? " bg-sky-100"
                                                    : "")
                                            }
                                        >
                                            <NextLink
                                                className="absolute inset-0 outline-none"
                                                href={p.path}
                                                onClick={() =>
                                                    setShowSidebar(false)
                                                }
                                                onTouchEnd={() =>
                                                    setShowSidebar(false)
                                                }
                                            />
                                            {p.name}
                                        </ListboxItem>
                                    );
                                })}
                        </ListboxSection>
                        <ListboxSection
                            title="Tanımlamalar"
                            classNames={{
                                heading: "text-zinc-500",
                            }}
                        >
                            {definitions
                                .filter((p) =>
                                    p.roles?.includes(user?.role ?? ""),
                                )
                                .map((p) => {
                                    return (
                                        <ListboxItem
                                            key={p.key}
                                            startContent={p.icon}
                                            className={
                                                "font-semibold" +
                                                (withoutFullLink == p.path
                                                    ? " bg-sky-100"
                                                    : "")
                                            }
                                        >
                                            <NextLink
                                                className="absolute inset-0 outline-none"
                                                href={p.path}
                                                onClick={() =>
                                                    setShowSidebar(false)
                                                }
                                                onTouchEnd={() =>
                                                    setShowSidebar(false)
                                                }
                                            />
                                            {p.name}
                                        </ListboxItem>
                                    );
                                })}
                        </ListboxSection>
                    </Listbox>
                </div>
                <Divider />
                <UserCard />
            </div>
        </>
    );
}
