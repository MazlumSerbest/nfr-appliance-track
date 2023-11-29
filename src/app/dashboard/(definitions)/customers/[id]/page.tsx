"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import {
    BiLinkExternal,
    BiX,
    BiShow,
    BiHide,
    BiCopy,
    BiCopyAlt,
} from "react-icons/bi";
import BoolChip from "@/components/BoolChip";
import { faker } from "@faker-js/faker";
import { Button } from "@nextui-org/button";

export default function CustomerDetail({
    params,
}: {
    params: { id: string };
}) {
    const router = useRouter();

    return (
        <div className="flex flex-col gap-4">
            <Card className="mt-4 mb-2 px-1 py-2">
                <CardBody className="gap-3">
                    <div className="flex items-center gap-2 pb-2 pl-1">
                        <p className="text-3xl font-bold text-sky-500">
                            {faker.company.name()}
                        </p>
                        <div className="flex-1"></div>
                        <BiX
                            className="text-3xl text-zinc-500 cursor-pointer active:opacity-50"
                            onClick={() => router.back()}
                        />
                    </div>
                    <div className="divide-y divide-zinc-200">
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">ID</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light gap-2 items-center mt-1 sm:mt-0">
                                {faker.string.uuid()}
                            </dd>
                        </div>
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Şehir</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light gap-2 items-center mt-1 sm:mt-0">
                                {faker.location.city()}
                            </dd>
                        </div>
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Aktif</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light gap-2 items-center mt-1 sm:mt-0">
                                <BoolChip value={true} />
                            </dd>
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="flex">
                    <div className="flex-1"></div>
                    <Button color="primary" className="bg-sky-500">
                        Düzenle
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
