"use client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { useDisclosure } from "@heroui/react";

import Skeleton, { DefaultSkeleton } from "@/components/loaders/Skeleton";
import AutoComplete from "@/components/AutoComplete";
import RegInfo from "@/components/buttons/RegInfo";
import DeleteButton from "@/components/buttons/DeleteButton";
import ControlHistoryTable from "./ControlHistoryTable";

import { CopyToClipboard } from "@/utils/functions";
import {
    BiLinkExternal,
    BiX,
    BiShow,
    BiHide,
    BiCopy,
    BiChevronLeft,
    BiListCheck,
} from "react-icons/bi";
import useUserStore from "@/store/user";
import { getCustomers, getBrands } from "@/lib/data";

interface IFormInput {
    ip: string;
    login: string;
    customerId: number;
    brandId: number;
    password: string;
    note?: string;
    controlled: boolean;
    updatedBy: string;
    customer?: Current;
    brand?: Brand;
    controlHistory?: ControlHistory[];
}

export default function ConnectionDetail({
    params,
}: {
    params: { id: string };
}) {
    const router = useRouter();
    const { user: currUser } = useUserStore();

    const [submitting, setSubmitting] = useState(false);
    const [submittingControl, setSubmittingControl] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [customers, setCustomers] = useState<ListBoxItem[] | null>(null);
    const [brands, setBrands] = useState<ListBoxItem[] | null>(null);

    const { isOpen, onClose, onOpenChange } = useDisclosure();

    const { data, error, mutate } = useSWR(
        `/api/connection/${params.id}`,
        null,
        {
            revalidateOnFocus: false,
            onSuccess: (con) => {
                reset(con);
            },
        },
    );

    //#region Form
    const { register, reset, handleSubmit, control } = useForm<IFormInput>();

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        data.updatedBy = currUser?.username ?? "";

        delete data["customer"];
        delete data["brand"];
        delete data["controlHistory"];

        await fetch(`/api/connection/${params.id}`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        }).then(async (res) => {
            const result = await res.json();
            if (result.ok) {
                toast.success(result.message);
                mutate();
            } else {
                toast.error(result.message);
            }
            return result;
        });
    };
    //#endregion

    //#region Data
    async function getData() {
        const cus: ListBoxItem[] = await getCustomers(true);
        setCustomers(cus);
        const bra: ListBoxItem[] = await getBrands(true);
        setBrands(bra);
    }

    useEffect(() => {
        getData();
    }, []);
    //#endregion

    if (error) return <div>Yükleme Hatası!</div>;
    if (!data || !customers || !brands)
        return (
            <div className="flex flex-col mt-4">
                <Skeleton>
                    <DefaultSkeleton />
                </Skeleton>
            </div>
        );
    if (currUser?.role == "seller")
        return <div>Bu sayfayı görme yetkiniz yoktur!</div>;
    return (
        <div className="flex flex-col gap-4">
            <Card className="mt-4 px-1 py-2">
                <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                    <CardBody className="gap-3">
                        <div className="flex items-center gap-2 pb-2 pl-1">
                            <p className="text-3xl font-bold text-sky-500">
                                {`https://${data.ip}`}
                            </p>
                            <a
                                href={`https://${data.ip}`}
                                target="_blank"
                                className="cursor-pointer"
                            >
                                <BiLinkExternal className="text-2xl text-sky-500" />
                            </a>
                            <div className="flex-1"></div>
                            <BiX
                                className="text-3xl text-zinc-500 cursor-pointer active:opacity-50"
                                onClick={() => router.back()}
                            />
                        </div>
                        <div className="divide-y divide-zinc-200">
                            <div className="grid grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <div>
                                    <label
                                        htmlFor="controlled"
                                        className="font-medium"
                                    >
                                        Gözetim Durumu
                                    </label>
                                </div>
                                <Controller
                                    control={control}
                                    name="controlled"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <Switch
                                            color="primary"
                                            onChange={onChange}
                                            isSelected={value}
                                            classNames={{
                                                wrapper:
                                                    "group-data-[selected=true]:bg-sky-500",
                                            }}
                                        />
                                    )}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="brandId"
                                    className="font-medium"
                                >
                                    Marka
                                </label>
                                <Controller
                                    control={control}
                                    name="brandId"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <AutoComplete
                                            onChange={onChange}
                                            value={value}
                                            data={brands || []}
                                            className="md:col-span-2 xl:col-span-1 my-1 sm:my-0"
                                        />
                                    )}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="ip"
                                    className="font-medium after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    IP/Domain
                                </label>
                                <div>
                                    <div className="flex md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500">
                                        <span className="flex select-none items-center pl-3 text-zinc-400 sm:text-sm">
                                            https://
                                        </span>
                                        <input
                                            type="text"
                                            id="ip"
                                            required
                                            className="flex-1 border-0 bg-transparent pl-1 pr-3.5 py-2 w-full text-zinc-700 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
                                            {...register("ip", {
                                                required: true,
                                                maxLength: 200,
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <div className="flex flex-row items-center gap-2">
                                    <label
                                        htmlFor="login"
                                        className="font-medium after:content-['*'] after:ml-0.5 after:text-red-500"
                                    >
                                        Kullanıcı
                                    </label>
                                    <BiCopy
                                        className="text-xl text-sky-500 cursor-pointer active:opacity-50"
                                        onClick={() =>
                                            CopyToClipboard(
                                                data.login,
                                                "Kullanıcı panoya kopyalandı!",
                                            )
                                        }
                                    />
                                </div>
                                <input
                                    type="text"
                                    id="login"
                                    required
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("login", {
                                        required: true,
                                        maxLength: 50,
                                    })}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <div className="flex flex-row items-center gap-2">
                                    <label
                                        htmlFor="password"
                                        className="font-medium after:content-['*'] after:ml-0.5 after:text-red-500"
                                    >
                                        Şifre
                                    </label>
                                    <BiCopy
                                        className="text-xl text-sky-500 cursor-pointer active:opacity-50"
                                        onClick={() =>
                                            CopyToClipboard(
                                                data.password,
                                                "Şifre panoya kopyalandı!",
                                            )
                                        }
                                    />
                                    {showPassword ? (
                                        <BiHide
                                            className="text-2xl cursor-pointer active:opacity-50"
                                            onClick={() =>
                                                setShowPassword(false)
                                            }
                                        />
                                    ) : (
                                        <BiShow
                                            className="text-2xl cursor-pointer active:opacity-50"
                                            onClick={() =>
                                                setShowPassword(true)
                                            }
                                        />
                                    )}
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    required
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("password", {
                                        required: true,
                                        maxLength: 50,
                                    })}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="customerId"
                                    className="font-medium"
                                >
                                    Müşteri
                                </label>
                                <Controller
                                    control={control}
                                    name="customerId"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <AutoComplete
                                            onChange={onChange}
                                            value={value}
                                            data={customers || []}
                                            className="md:col-span-2 xl:col-span-1 my-1 sm:my-0"
                                        />
                                    )}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label htmlFor="note" className="font-medium">
                                    Not
                                </label>
                                <textarea
                                    id="note"
                                    rows={4}
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("note", {
                                        maxLength: 500,
                                    })}
                                />
                            </div>
                        </div>
                    </CardBody>
                    <CardFooter className="flex gap-2">
                        <div className="flex-1"></div>

                        {data.controlled && (
                            <Popover
                                key={data.id}
                                placement="top"
                                color="default"
                                backdrop="opaque"
                                isOpen={isOpen}
                                onOpenChange={onOpenChange}
                            >
                                <PopoverTrigger>
                                    <Button
                                        color="primary"
                                        className="bg-yellow-500"
                                    >
                                        Gözetim Ekle
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="flex flex-col gap-2 p-3">
                                    <h2 className="text-lg font-semibold text-zinc-600">
                                        Gözetim Ekleme
                                    </h2>
                                    <p className="text-sm text-zinc-500 pb-2">
                                        Bu bağlantıya kendi kullanıcınız adına
                                        gözetim eklenecek. Devam etmek
                                        istediğinizden emin misiniz?
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="bordered"
                                            onPress={onClose}
                                        >
                                            Kapat
                                        </Button>
                                        <Button
                                            variant="solid"
                                            color="danger"
                                            className="bg-yellow-500"
                                            isLoading={submittingControl}
                                            onPress={async () => {
                                                setSubmittingControl(true);

                                                const control = {
                                                    userId: currUser?.id,
                                                    createdBy:
                                                        currUser?.username,
                                                };

                                                await fetch(
                                                    `/api/connection/${params.id}/control`,
                                                    {
                                                        method: "POST",
                                                        body: JSON.stringify(
                                                            control,
                                                        ),
                                                        headers: {
                                                            "Content-Type":
                                                                "application/json",
                                                        },
                                                    },
                                                ).then(async (res) => {
                                                    const result =
                                                        await res.json();
                                                    if (result.ok) {
                                                        toast.success(
                                                            result.message,
                                                        );
                                                        mutate();
                                                        onClose();
                                                    } else {
                                                        toast.error(
                                                            result.message,
                                                        );
                                                    }

                                                    setSubmittingControl(false);
                                                    return result;
                                                });
                                            }}
                                        >
                                            Ekle
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}

                        <RegInfo
                            data={data}
                            isButton
                            trigger={
                                <Button color="primary" className="bg-sky-500">
                                    Kayıt Bilgisi
                                </Button>
                            }
                        />

                        <DeleteButton
                            table="connections"
                            data={data}
                            mutate={mutate}
                            isButton={true}
                            router={router}
                            trigger={
                                <Button color="primary" className="bg-red-500">
                                    Sil
                                </Button>
                            }
                        />

                        <Button
                            type="submit"
                            color="primary"
                            className="text-white bg-green-600"
                            isLoading={submitting}
                        >
                            Kaydet
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <Accordion
                selectionMode="multiple"
                variant="splitted"
                defaultExpandedKeys={
                    data?.controlled || data?.controlHistory?.length
                        ? ["controlHistory"]
                        : []
                }
                className="!p-0"
                itemClasses={{
                    title: "font-medium text-zinc-600",
                    base: "px-4 py-3",
                    content: "border-t border-zinc-200 py-0",
                }}
            >
                <AccordionItem
                    key="controlHistory"
                    aria-label="controlHistory"
                    title="Gözetim Listesi"
                    subtitle="Bu bağlantıya ait gözetim listesi"
                    indicator={
                        <BiChevronLeft className="text-3xl text-zinc-500" />
                    }
                    startContent={
                        <BiListCheck className="text-4xl text-yellow-500/60" />
                    }
                >
                    <ControlHistoryTable
                        controlHistory={data?.controlHistory}
                    />
                </AccordionItem>
            </Accordion>
        </div>
    );
}
