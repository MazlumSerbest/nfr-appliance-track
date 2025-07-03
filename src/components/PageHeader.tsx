"use client";
import { useRouter, usePathname } from "next/navigation";
import { Divider } from "@heroui/divider";
import { BiX } from "react-icons/bi";

type Props = {
    title: string;
    close?: boolean;
};

export default function PageHeader({ title, close = false }: Props) {
    const router = useRouter();
    const pathName = usePathname();
    return (
        <div>
            <div className="flex mt-3 md:mt-0 mb-2">
                {/* <FiArrowLeft className="text-3xl text-zinc-500 cursor-pointer m-auto mr-4" onClick={() => router.back()}/> */}
                <h1 className="truncate text-3xl font-semibold text-zinc-500">
                    {title}
                </h1>
                <div className="flex-1"></div>
                {close && /\d/.test(pathName) ? (
                    <BiX
                        className="text-3xl text-zinc-500 cursor-pointer m-auto mr-4"
                        onClick={() => router.back()}
                    />
                ) : null}
            </div>
            <Divider />
        </div>
    );
}
