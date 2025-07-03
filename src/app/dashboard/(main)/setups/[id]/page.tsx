"use client";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, Controller, set } from "react-hook-form";
import toast from "react-hot-toast";

import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";

import Skeleton, { DefaultSkeleton } from "@/components/loaders/Skeleton";
import AutoComplete from "@/components/AutoComplete";
import RegInfo from "@/components/buttons/RegInfo";
import DeleteButton from "@/components/buttons/DeleteButton";
import { BiShield, BiSolidCheckShield, BiX } from "react-icons/bi";
import useUserStore from "@/store/user";
import { getUsers } from "@/lib/data";
import { DateTimeFormat, DateToForm } from "@/utils/date";
import { Tooltip } from "@heroui/react";

interface IFormInput {
    status: "waiting" | "complete";
    type: "appliance" | "license";
    userId: number;
    applianceId?: number;
    licenseId?: number;
    note?: string;
    updatedBy: string;
    completedAt?: string;
}

export default function SetupDetail({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { user: currUser } = useUserStore();

    const [submitting, setSubmitting] = useState(false);
    const [applianceId, setApplianceId] = useState<number | undefined>();
    const [licenseId, setLicenseId] = useState<number | undefined>();

    const [users, setUsers] = useState<ListBoxItem[] | null>(null);

    const { data, error, isLoading, mutate } = useSWR(
        `/api/setup/${params.id}`,
        null,
        {
            revalidateOnFocus: false,
            onSuccess: (pro) => {
                reset({
                    status: pro.status,
                    userId: pro.userId,
                    note: pro.note,
                    completedAt: DateToForm(pro.completedAt),
                });
            },
        },
    );

    //#region Form
    const {
        register,
        reset,
        resetField,
        setValue,
        getValues,
        handleSubmit,
        control,
    } = useForm<IFormInput>();

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setSubmitting(true);
        data.updatedBy = currUser?.username ?? "";

        await fetch(`/api/setup/${params.id}`, {
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

            setSubmitting(false);
            return result;
        });
    };
    //#endregion

    //#region Data
    async function getData() {
        const users: ListBoxItem[] = await getUsers(true, currUser);
        setUsers(users);
    }

    useEffect(() => {
        getData();
    }, []);
    //#endregion

    if (error) return <div>Yükleme Hatası!</div>;
    if (isLoading || !users)
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
                <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                    <CardBody className="gap-3">
                        <div className="flex items-center gap-2 pb-2 pl-1">
                            <p className="text-2xl font-bold text-sky-500">
                                {data.product || data.licenseType}
                            </p>
                            {data.status === "complete" ? (
                                <BiSolidCheckShield
                                    className="text-3xl text-green-600 cursor-pointer active:opacity-50"
                                    onClick={() => router.back()}
                                />
                            ) : (
                                <BiShield
                                    className="text-3xl text-yellow-500 cursor-pointer active:opacity-50"
                                    onClick={() => router.back()}
                                />
                            )}
                            <div className="flex-1"></div>
                            <BiX
                                className="text-3xl text-zinc-500 cursor-pointer active:opacity-50"
                                onClick={() => router.back()}
                            />
                        </div>
                        <div className="divide-y divide-zinc-200">
                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <dt className="font-medium">Durum</dt>
                                <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0 gap-2">
                                    {data.status === "complete"
                                        ? "Tamamlandı"
                                        : "Bekleyen"}
                                    {data.status === "complete" ? (
                                        <></>
                                    ) : (
                                        // <Button
                                        //     variant="solid"
                                        //     className="bg-indigo-500"
                                        //     radius="sm"
                                        //     isIconOnly
                                        // >
                                        //     <BiSolidCheckShield className="size-5 text-white" />
                                        // </Button>
                                        <Tooltip content="Tamamlandı Olarak İşaretle">
                                            <Button
                                                variant="solid"
                                                className="bg-indigo-500"
                                                radius="sm"
                                                isIconOnly
                                                onPress={async () => {
                                                    const res = await fetch(
                                                        `/api/setup/${params.id}/complete`,
                                                        {
                                                            method: "PUT",
                                                            headers: {
                                                                "Content-Type":
                                                                    "application/json",
                                                            },
                                                        },
                                                    );
                                                    const result =
                                                        await res.json();
                                                    if (result.ok) {
                                                        toast.success(
                                                            result.message,
                                                        );
                                                        mutate();
                                                    } else {
                                                        toast.error(
                                                            result.message,
                                                        );
                                                    }
                                                }}
                                            >
                                                <BiSolidCheckShield className="size-5 text-white" />
                                            </Button>
                                        </Tooltip>
                                    )}
                                </dd>
                            </div>

                            {data.completedAt && (
                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2 items-center">
                                    <dt className="font-medium">
                                        Tamamlanma Tarihi
                                    </dt>
                                    <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                        {DateTimeFormat(data.completedAt)}
                                    </dd>
                                </div>
                            )}

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2 items-center">
                                <dt className="font-medium">Tip</dt>
                                <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                    {data.type === "license"
                                        ? "Lisans"
                                        : "Cihaz"}
                                </dd>
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="invoiceNo"
                                    className="font-medium"
                                >
                                    Atanmış Kullanıcı
                                </label>
                                <Controller
                                    control={control}
                                    name="userId"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <AutoComplete
                                            onChange={onChange}
                                            value={value}
                                            data={users || []}
                                            className="md:col-span-2 xl:col-span-1 my-1 sm:my-0"
                                        />
                                    )}
                                />
                            </div>

                            {data.type === "appliance" && (
                                <>
                                    <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2 items-center">
                                        <dt className="font-medium">
                                            Ürün (Model)
                                        </dt>
                                        <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                            {data.product || "-"}
                                        </dd>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2 items-center">
                                        <dt className="font-medium">
                                            Cihaz Seri No
                                        </dt>
                                        <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                            {data.applianceSerialNo || "-"}
                                        </dd>
                                    </div>
                                </>
                            )}

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2 items-center">
                                <dt className="font-medium">Lisans Tipi</dt>
                                <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                    {data.licenseType || "-"}
                                </dd>
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2 items-center">
                                <dt className="font-medium">Lisans Seri No</dt>
                                <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                    {data.licenseSerialNo || "-"}
                                </dd>
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2 items-center">
                                <dt className="font-medium">Müşteri</dt>
                                <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                    {data.customerName || "-"}
                                </dd>
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2 items-center">
                                <dt className="font-medium">Bayi</dt>
                                <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                    {data.dealerName || "-"}
                                </dd>
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2 items-center">
                                <dt className="font-medium">Alt Bayi</dt>
                                <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                    {data.subDealerName || "-"}
                                </dd>
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2 items-center">
                                <dt className="font-medium">Tedarikçi</dt>
                                <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                    {data.supplierName || "-"}
                                </dd>
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

                    {currUser?.role === "technical" ? undefined : (
                        <CardFooter className="flex gap-2">
                            <div className="flex-1"></div>
                            <RegInfo
                                data={data}
                                isButton
                                trigger={
                                    <Button
                                        type="button"
                                        color="primary"
                                        className="bg-sky-500"
                                    >
                                        Kayıt Bilgisi
                                    </Button>
                                }
                            />

                            <DeleteButton
                                table="setups"
                                data={data}
                                mutate={mutate}
                                isButton={true}
                                router={router}
                                trigger={
                                    <Button
                                        color="primary"
                                        className="bg-red-500"
                                    >
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
                    )}
                </form>
            </Card>
        </div>
    );
}
