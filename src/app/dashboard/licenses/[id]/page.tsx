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
import BoolChip from "@/components/BoolChip";
import RegInfo from "@/components/RegInfo";
import { BiChevronLeft, BiServer, BiX } from "react-icons/bi";
import useUserStore from "@/store/user";
import toast from "react-hot-toast";
import { boughtTypes } from "@/lib/constants";
import { DateFormat } from "@/utils/date";

export default function LicenseDetail({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    // const [con, setCon] = useState();
    const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
    const { user: currUser } = useUserStore();

    const { data, error, mutate } = useSWR(`/api/license/${params.id}`, null, {
        onSuccess: (lic) => {
            // setCon(con);
            // reset(con);
        },
    });

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
                            {data.licenseType?.product?.brand +
                                " " +
                                data.licenseType.product?.model}
                        </p>
                        <div className="flex-1"></div>
                        <BiX
                            className="text-3xl text-zinc-500 cursor-pointer active:opacity-50"
                            onClick={() => router.back()}
                        />
                    </div>
                    <div className="divide-y divide-zinc-200">
                        <div className="grid grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Stok Lisans</dt>
                            <dd className="col-span-1 md:col-span-2">
                                <BoolChip value={data.isStock} />
                            </dd>
                        </div>

                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Alım Tipi</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {boughtTypes.find(
                                    (e) => e.key == data.boughtType,
                                )?.name || "-"}
                            </dd>
                        </div>

                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Lisans Tipi</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {data.licenseType.type}
                            </dd>
                        </div>

                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Lisans Süresi</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {data.licenseType?.duration
                                    ? data.licenseType.duration + " ay"
                                    : "-"}
                            </dd>
                        </div>

                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Başlangıç Tarihi</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {DateFormat(data.startDate) || "-"}
                            </dd>
                        </div>
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Bitiş Tarihi</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {DateFormat(data.expiryDate) || "-"}
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
                // defaultExpandedKeys={["appliance"]}
                className="p-0"
                itemClasses={{
                    title: "font-medium text-zinc-600",
                    base: "px-1 py-2",
                }}
            >
                <AccordionItem
                    key="appliance"
                    aria-label="appliance"
                    title="Cihaz Bilgileri"
                    subtitle="Bu lisansın ait olduğu cihaz bilgileri"
                    indicator={<BiChevronLeft className="text-3xl text-zinc-500" />}
                    startContent={
                        <BiServer className="text-4xl text-green-600/60" />
                    }
                >
                    {data.appliance.length ? (
                        <>
                            <div className="divide-y divide-zinc-200 text-zinc-500">
                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base p-2">
                                    <dt className="font-medium">Seri No</dt>
                                    <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                        {data.appliance[0]?.serialNo || "-"}
                                    </dd>
                                </div>

                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base p-2">
                                    <dt className="font-medium">Alım Tarihi</dt>
                                    <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                        {DateFormat(
                                            data.appliance[0]?.boughtAt,
                                        ) || "-"}
                                    </dd>
                                </div>
                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base p-2">
                                    <dt className="font-medium">
                                        Satış Tarihi
                                    </dt>
                                    <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                        {DateFormat(
                                            data.appliance[0]?.soldAt,
                                        ) || "-"}
                                    </dd>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1"></div>
                                <Button
                                    color="primary"
                                    className="bg-sky-500"
                                    onPress={() =>
                                        router.push(
                                            `/dashboard/appliances/${data.appliance[0]?.id}`,
                                        )
                                    }
                                >
                                    Cihaza Git
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="w-full py-4 text-center">
                            <p className="text-zinc-400">
                                Bu lisans herhangi bir cihaza ait değildir.
                            </p>
                        </div>
                    )}
                </AccordionItem>
            </Accordion>
        </div>
    );
}
