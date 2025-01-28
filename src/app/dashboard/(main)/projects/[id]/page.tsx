"use client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";

import Skeleton, { DefaultSkeleton } from "@/components/loaders/Skeleton";
import AutoComplete from "@/components/AutoComplete";
import RegInfo from "@/components/buttons/RegInfo";
import DeleteButton from "@/components/buttons/DeleteButton";
import { CopyToClipboard } from "@/utils/functions";
import { BiLinkExternal, BiX, BiShow, BiHide, BiCopy } from "react-icons/bi";
import useUserStore from "@/store/user";
import {
    getCustomers,
    getDealers,
    getProducts,
    getLicenseTypes,
} from "@/lib/data";
import { projectStatus } from "@/lib/constants";

interface IFormInput {
    date: string;
    customerId: number;
    dealerId?: number;
    productId?: number;
    licenseTypeId?: number;
    note?: string;
    status: string;
    updatedBy: string;
    customer?: Current;
    dealer?: Current;
    product?: Product;
    licenseType?: LicenseType;
}

export default function ProjectDetail({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { user: currUser } = useUserStore();

    const [customers, setCustomers] = useState<ListBoxItem[] | null>(null);
    const [dealers, setDealers] = useState<ListBoxItem[] | null>(null);
    const [products, setProducts] = useState<ListBoxItem[] | null>(null);
    const [licenseTypes, setLicenseTypes] = useState<ListBoxItem[] | null>(
        null,
    );

    //#region Form
    const { register, reset, setValue, handleSubmit, control } =
        useForm<IFormInput>();
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        data.updatedBy = currUser?.username ?? "";
        delete data["customer"];
        delete data["dealer"];
        delete data["product"];
        delete data["licenseType"];

        await fetch(`/api/project/${params.id}`, {
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
        const dea: ListBoxItem[] = await getDealers(true);
        setDealers(dea);
        const pro: ListBoxItem[] = await getProducts(true);
        setProducts(pro);
        const lic: ListBoxItem[] = await getLicenseTypes(true);
        setLicenseTypes(lic);
    }

    useEffect(() => {
        getData();
    }, []);
    //#endregion

    const { data, error, mutate } = useSWR(`/api/project/${params.id}`, null, {
        revalidateOnFocus: false,
        onSuccess: (pro) => {
            reset(pro);
            setValue("date", pro.date?.split("T")[0]);
        },
    });

    if (error) return <div>Yükleme Hatası!</div>;
    if (!data || !customers || !dealers || !products || !licenseTypes)
        return (
            <div className="flex flex-col mt-4">
                <Skeleton>
                    <DefaultSkeleton />
                </Skeleton>
            </div>
        );
    return (
        <div className="flex flex-col gap-4">
            <Card className="mt-4 px-1 py-2">
                <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                    <CardBody className="gap-3">
                        <div className="flex items-center pb-2 pl-1">
                            <p className="text-3xl font-bold text-sky-500">
                                {data.customer?.name}
                            </p>
                            <div className="flex-1"></div>
                            <BiX
                                className="text-3xl text-zinc-500 cursor-pointer active:opacity-50"
                                onClick={() => router.back()}
                            />
                        </div>
                        <div className="divide-y divide-zinc-200">
                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label htmlFor="status" className="font-medium">
                                    Durum
                                </label>
                                <div className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full h-10 rounded-md border-0 px-3 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2">
                                    <select
                                        id="status"
                                        className="w-full border-none text-sm text-zinc-700 outline-none"
                                        {...register("status")}
                                    >
                                        {projectStatus?.map((ps) => (
                                            <option key={ps.key} value={ps.key}>
                                                {ps.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="date"
                                    className="font-medium after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Proje Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    required
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("date", { required: true })}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="customerId"
                                    className="font-medium after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Müşteri
                                </label>
                                <Controller
                                    control={control}
                                    name="customerId"
                                    rules={{ required: true }}
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
                                <label
                                    htmlFor="dealerId"
                                    className="font-medium"
                                >
                                    Bayi
                                </label>
                                <Controller
                                    control={control}
                                    name="dealerId"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <AutoComplete
                                            onChange={onChange}
                                            value={value}
                                            data={dealers || []}
                                            className="md:col-span-2 xl:col-span-1 my-1 sm:my-0"
                                        />
                                    )}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="productId"
                                    className="font-medium"
                                >
                                    Ürün
                                </label>
                                <Controller
                                    control={control}
                                    name="productId"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <AutoComplete
                                            onChange={onChange}
                                            value={value}
                                            data={products || []}
                                            className="md:col-span-2 xl:col-span-1 my-1 sm:my-0"
                                        />
                                    )}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="licenseTypeId"
                                    className="font-medium"
                                >
                                    Lisans Tipi
                                </label>
                                <Controller
                                    control={control}
                                    name="licenseTypeId"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <AutoComplete
                                            onChange={onChange}
                                            value={value}
                                            data={licenseTypes || []}
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
                    {currUser?.role === "technical" ? undefined : (
                        <CardFooter className="flex gap-2">
                            <div className="flex-1"></div>
                            <RegInfo
                                data={data}
                                isButton
                                trigger={
                                    <Button
                                        color="primary"
                                        className="bg-sky-500"
                                    >
                                        Kayıt Bilgisi
                                    </Button>
                                }
                            />

                            <DeleteButton
                                table="projects"
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
