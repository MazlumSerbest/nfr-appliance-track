"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

import { Card, CardBody, CardFooter } from "@nextui-org/card";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
} from "@nextui-org/modal";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Button } from "@nextui-org/button";

import { SubmitHandler, useForm } from "react-hook-form";
import Skeleton, { DefaultSkeleton } from "@/components/loaders/Skeleton";
import RegInfo from "@/components/RegInfo";
import {
    BiX,
    BiCheckShield,
    BiChevronLeft,
    BiChevronRight,
} from "react-icons/bi";
import useUserStore from "@/store/user";
import toast from "react-hot-toast";
import { DateFormat, DateTimeFormat } from "@/utils/date";

export default function ApplianceDetail({
    params,
}: {
    params: { id: string };
}) {
    const router = useRouter();
    const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
    const { user: currUser } = useUserStore();

    const { data, error, mutate } = useSWR(
        `/api/appliance/${params.id}`,
        null,
        {
            onSuccess: (lic) => {
                // setCon(con);
                // reset(con);
            },
        },
    );

    if (error) return <div>Yükleme Hatası!</div>;
    if (!data)
        return (
            <div className="flex flex-col mt-4">
                <Skeleton>
                    <DefaultSkeleton />
                </Skeleton>
            </div>
        );
    return (
        <div className="flex flex-col gap-2">
            <Card className="mt-4 px-1 py-2">
                <CardBody className="gap-3">
                    <div className="flex items-center pb-2 pl-1">
                        <p className="text-3xl font-bold text-sky-500">
                            {data.serialNo}
                        </p>
                        <div className="flex-1"></div>
                        <BiX
                            className="text-3xl text-zinc-500 cursor-pointer active:opacity-50"
                            onClick={() => router.back()}
                        />
                    </div>
                    <div className="divide-y divide-zinc-200">
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Ürün</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {data.product?.brand +
                                    " " +
                                    data.product?.model || "-"}
                            </dd>
                        </div>
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Alım Tarihi</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {DateFormat(data.boughtAt) || "-"}
                            </dd>
                        </div>
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Satış Tarihi</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {DateFormat(data.soldAt) || "-"}
                            </dd>
                        </div>

                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Müşteri</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {data.customer?.name || "-"}
                            </dd>
                        </div>
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Bayi</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {data.dealer?.name || "-"}
                            </dd>
                        </div>
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Tedarikçi</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {data.supplier?.name || "-"}
                            </dd>
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="flex gap-2">
                    <div className="flex-1"></div>
                    <RegInfo
                        data={data}
                        trigger={
                            <Button color="primary" className="bg-green-600">
                                Kayıt Bilgisi
                            </Button>
                        }
                    />
                    <Button
                        color="primary"
                        className="bg-red-600"
                        // onPress={onOpen}
                    >
                        Sil
                    </Button>
                    <Button
                        color="primary"
                        className="bg-sky-500"
                        onPress={onOpen}
                    >
                        Düzenle
                    </Button>
                </CardFooter>
            </Card>
            <Accordion
                selectionMode="multiple"
                variant="splitted"
                // defaultExpandedKeys={["license"]}
                className="p-0"
                itemClasses={{
                    title: "font-medium text-zinc-600",
                    // base: "px-1",
                }}
            >
                <AccordionItem
                    key="license"
                    aria-label="License"
                    title="Lisans Bilgileri"
                    subtitle="Bu cihaza tanımlanmış lisans bilgileri"
                    indicator={
                        <BiChevronLeft className="text-3xl text-zinc-500" />
                    }
                    startContent={
                        <BiCheckShield className="text-4xl text-green-600/60" />
                    }
                >
                    {data.licenses.length > 0 ? (
                        <>
                            <ul
                                role="list"
                                className="divide-y divide-zinc-200"
                            >
                                <li></li>
                                {data?.licenses.map((lic: License) => (
                                    <li
                                        onClick={() =>
                                            router.push(
                                                `/dashboard/licenses/${lic?.id}`,
                                            )
                                        }
                                        key={lic.id}
                                        className="flex justify-between py-2 items-center cursor-pointer"
                                    >
                                        <div className="flex flex-1 gap-x-4">
                                            <div className="min-w-0 flex-auto">
                                                <p className="text-sm font-semibold leading-6 text-zinc-600">
                                                    {`${
                                                        lic.licenseType?.type
                                                    } - ${
                                                        lic.licenseType
                                                            ?.duration
                                                    } ay${
                                                        lic.isStock
                                                            ? " (Stok)"
                                                            : ""
                                                    }`}
                                                </p>
                                                <div className="max-w-fit text-xs leading-5 text-zinc-400">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <dt className="font-semibold text-zinc-500">
                                                            {
                                                                "Başlangıç Tarihi:"
                                                            }
                                                        </dt>
                                                        <dd>
                                                            {DateFormat(
                                                                lic.startDate,
                                                            ) || " -"}
                                                        </dd>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <dt className="font-semibold text-zinc-500">
                                                            {"Bitiş Tarihi:"}
                                                        </dt>
                                                        <dd>
                                                            {DateFormat(
                                                                lic.expiryDate,
                                                            ) || " -"}
                                                        </dd>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <BiChevronRight className="text-2xl text-zinc-500" />
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <div className="w-full py-6 text-center">
                            <p className="text-zinc-400">
                                Bu cihaza herhangi bir lisans tanımlanmamıştır.
                            </p>
                        </div>
                    )}
                </AccordionItem>
            </Accordion>
        </div>
    );
}
