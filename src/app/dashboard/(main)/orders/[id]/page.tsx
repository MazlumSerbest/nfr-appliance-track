"use client";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, Controller, set } from "react-hook-form";
import toast from "react-hot-toast";

import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    useDisclosure,
} from "@heroui/modal";

import Skeleton, { DefaultSkeleton } from "@/components/loaders/Skeleton";
import AutoComplete from "@/components/AutoComplete";
import RegInfo from "@/components/buttons/RegInfo";
import DeleteButton from "@/components/buttons/DeleteButton";
import {
    BiInfoCircle,
    BiPlus,
    BiSolidCheckShield,
    BiSolidServer,
    BiX,
} from "react-icons/bi";
import useUserStore from "@/store/user";
import {
    getCustomers,
    getDealers,
    getSuppliers,
    getProducts,
    getLicenseTypes,
    getLicenses,
    getAppliances,
} from "@/lib/data";
import { currencyTypes, orderStatus } from "@/lib/constants";
import { Tooltip } from "@heroui/react";
import ApplianceForm from "@/components/ApplianceForm";

interface IFormInput {
    status: "order" | "invoice" | "purchase" | "complete";
    registerNo?: string;
    invoiceNo?: string;
    paymentPlan?: string;
    soldAt?: string;
    applianceId?: number;
    licenseId?: number;
    currency?: "TRY" | "USD" | "EUR";
    appliancePrice?: number;
    licensePrice?: number;
    address?: string;
    note?: string;
    customerId: number;
    cusName?: string;
    dealerId?: number;
    subDealerId: number;
    supplierId: number;
    updatedBy: string;
    customer?: Current;
    dealer?: Current;
    subDealer?: Current;
    supplier?: Current;
    appliance?: Appliance;
    license?: License;
}

export default function OrderDetail({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { user: currUser } = useUserStore();

    const [submitting, setSubmitting] = useState(false);
    const [applianceId, setApplianceId] = useState<number | undefined>();
    const [licenseId, setLicenseId] = useState<number | undefined>();

    const [products, setProducts] = useState<ListBoxItem[] | null>(null);
    const [appliances, setAppliances] = useState<ListBoxItem[] | null>(null);
    const [licenseTypes, setLicenseTypes] = useState<ListBoxItem[] | null>(
        null,
    );
    const [licenses, setLicenses] = useState<ListBoxItem[] | null>(null);

    const [customers, setCustomers] = useState<ListBoxItem[] | null>(null);
    const [dealers, setDealers] = useState<ListBoxItem[] | null>(null);
    const [suppliers, setSuppliers] = useState<ListBoxItem[] | null>(null);

    const [totalPrice, setTotalPrice] = useState<number>(0);

    const {
        isOpen: isOpenApp,
        onClose: onCloseApp,
        onOpen: onOpenApp,
        onOpenChange: onOpenChangeApp,
    } = useDisclosure();
    const {
        isOpen: isOpenLicense,
        onClose: onCloseLicense,
        onOpen: onOpenLicense,
        onOpenChange: onOpenChangeLicense,
    } = useDisclosure();

    const { data, error, isLoading, mutate } = useSWR(
        `/api/order/${params.id}`,
        null,
        {
            revalidateOnFocus: false,
            onSuccess: (pro) => {
                reset(pro);
                setValue("soldAt", pro.soldAt?.split("T")[0]);
                setTotalPrice(
                    parseFloat(pro.appliancePrice || 0) +
                        parseFloat(pro.licensePrice || 0),
                );
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
        delete data["appliance"];
        delete data["license"];
        delete data["customer"];
        delete data["dealer"];
        delete data["subDealer"];
        delete data["supplier"];

        await fetch(`/api/order/${params.id}`, {
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
        const cus: ListBoxItem[] = await getCustomers(true);
        setCustomers(cus);
        const dea: ListBoxItem[] = await getDealers(true);
        setDealers(dea);
        const sup: ListBoxItem[] = await getSuppliers(true);
        setSuppliers(sup);
        const pro: ListBoxItem[] = await getProducts(true);
        setProducts(pro);
        const lt: ListBoxItem[] = await getLicenseTypes(true);
        setLicenseTypes(lt);
    }

    useEffect(() => {
        getData();
    }, []);
    //#endregion

    if (error) return <div>Yükleme Hatası!</div>;
    if (
        isLoading ||
        !customers ||
        !dealers ||
        !suppliers ||
        !products ||
        !licenseTypes
    )
        return (
            <div className="flex flex-col mt-4">
                <Skeleton>
                    <DefaultSkeleton />
                </Skeleton>
            </div>
        );
    return (
        <>
            <div className="flex flex-col gap-2">
                <Card className="mt-4 px-1 py-2">
                    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                        <CardBody className="gap-3">
                            <div className="flex items-center pb-2 pl-1">
                                <p className="text-3xl font-bold text-sky-500">
                                    {data.registerNo}
                                </p>
                                <div className="flex-1"></div>
                                <BiX
                                    className="text-3xl text-zinc-500 cursor-pointer active:opacity-50"
                                    onClick={() => router.back()}
                                />
                            </div>
                            <div className="divide-y divide-zinc-200">
                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                    <label
                                        htmlFor="status"
                                        className="font-medium"
                                    >
                                        Durum
                                    </label>
                                    <div className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full h-10 rounded-md border-0 px-3 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2">
                                        <select
                                            id="status"
                                            className="w-full border-none text-sm text-zinc-700 outline-none"
                                            {...register("status")}
                                        >
                                            {orderStatus?.map((os) => (
                                                <option
                                                    key={os.key}
                                                    value={os.key}
                                                >
                                                    {os.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                    <label
                                        htmlFor="registerNo"
                                        className="font-medium"
                                    >
                                        Kayıt No
                                    </label>
                                    <input
                                        type="text"
                                        id="registerNo"
                                        className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                        {...register("registerNo", {
                                            maxLength: 50,
                                        })}
                                    />
                                </div>

                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                    <label
                                        htmlFor="invoiceNo"
                                        className="font-medium"
                                    >
                                        Fatura No
                                    </label>
                                    <input
                                        type="text"
                                        id="invoiceNo"
                                        className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                        {...register("invoiceNo", {
                                            maxLength: 50,
                                        })}
                                    />
                                </div>

                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                    <label className="font-medium">
                                        Cihaz Seri No
                                    </label>
                                    <input
                                        disabled
                                        type="text"
                                        className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                        value={data.appliance?.serialNo}
                                    />
                                </div>

                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                    <label
                                        htmlFor="invoiceNo"
                                        className="font-medium"
                                    >
                                        Cihaz
                                    </label>
                                    <div className="flex flex-row gap-1 md:col-span-2 xl:col-span-1 my-1 sm:my-0">
                                        <input
                                            disabled
                                            type="text"
                                            id="invoiceNo"
                                            className="my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                            value={
                                                products.find(
                                                    (p) =>
                                                        p.id ===
                                                        data.appliance?.product
                                                            .id,
                                                )?.name
                                            }
                                        />
                                        <Tooltip content="Cihaz Seç">
                                            <Button
                                                color="primary"
                                                className="bg-sky-500 rounded-md"
                                                radius="sm"
                                                isIconOnly
                                                onPress={onOpenApp}
                                            >
                                                <BiSolidServer className="size-5" />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                    <label
                                        htmlFor="appliancePrice"
                                        className="font-medium"
                                    >
                                        Cihaz Fiyatı
                                    </label>
                                    <div className="flex flex-row md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full h-10 gap-1">
                                        <input
                                            type="number"
                                            id="appliancePrice"
                                            min="1"
                                            step="any"
                                            className="flex-1 rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                            {...register("appliancePrice")}
                                        />

                                        <div className="rounded-md border-0 px-4 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 sm:text-sm sm:leading-6 outline-none">
                                            <p>
                                                {
                                                    currencyTypes?.find(
                                                        (ct) =>
                                                            ct.key ===
                                                            getValues(
                                                                "currency",
                                                            ),
                                                    )?.symbol
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {data?.license?.appSerialNo && (
                                    <>
                                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                            <label className="font-medium">
                                                Ürün (Lisans Üzerinden)
                                            </label>
                                            <input
                                                disabled
                                                type="text"
                                                className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                                value={
                                                    data.license?.product?.brand
                                                        ?.name +
                                                    " " +
                                                    data.license?.product?.model
                                                }
                                            />
                                        </div>

                                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                            <label className="font-medium">
                                                Cihaz Seri No (Lisans Üzerinden)
                                            </label>
                                            <input
                                                disabled
                                                type="text"
                                                className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                                value={
                                                    data.license?.appSerialNo
                                                }
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                    <label className="font-medium">
                                        Lisans Seri No
                                    </label>
                                    <input
                                        disabled
                                        type="text"
                                        className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                        value={data.license?.serialNo}
                                    />
                                </div>

                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                    <label className="font-medium">
                                        Lisans
                                    </label>
                                    <div className="flex flex-row gap-1 md:col-span-2 xl:col-span-1 my-1 sm:my-0">
                                        <input
                                            disabled
                                            type="text"
                                            className="my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                            value={
                                                licenseTypes.find(
                                                    (lt) =>
                                                        lt.id ===
                                                        data.license
                                                            ?.licenseType.id,
                                                )?.name
                                            }
                                        />
                                        <Tooltip content="Lisans Seç">
                                            <Button
                                                color="primary"
                                                className="bg-green-600 rounded-md"
                                                radius="sm"
                                                isIconOnly
                                                onPress={onOpenLicense}
                                            >
                                                <BiSolidCheckShield className="size-5" />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                    <label
                                        htmlFor="licensePrice"
                                        className="font-medium"
                                    >
                                        Lisans Fiyatı
                                    </label>
                                    <div className="flex flex-row md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full h-10 gap-1">
                                        <input
                                            type="number"
                                            id="licensePrice"
                                            min="1"
                                            step="any"
                                            className="flex-1 rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                            {...register("licensePrice")}
                                        />

                                        <div className="rounded-md border-0 px-4 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 sm:text-sm sm:leading-6 outline-none">
                                            <p>
                                                {
                                                    currencyTypes?.find(
                                                        (ct) =>
                                                            ct.key ===
                                                            getValues(
                                                                "currency",
                                                            ),
                                                    )?.symbol
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                    <label
                                        htmlFor="soldAt"
                                        className="font-medium"
                                    >
                                        Satış Tarihi
                                    </label>
                                    <input
                                        type="date"
                                        id="soldAt"
                                        className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                        {...register("soldAt")}
                                    />
                                </div>

                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                    <label
                                        htmlFor="paymentPlan"
                                        className="font-medium"
                                    >
                                        Vade
                                    </label>
                                    <input
                                        type="text"
                                        id="paymentPlan"
                                        className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                        {...register("paymentPlan")}
                                    />
                                </div>

                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                    <label
                                        htmlFor="currency"
                                        className="font-medium"
                                    >
                                        Toplam Fiyat
                                    </label>
                                    <div className="flex flex-row md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full h-10 gap-1">
                                        <input
                                            disabled
                                            value={totalPrice.toLocaleString(
                                                "tr-TR",
                                                {
                                                    maximumFractionDigits: 2,
                                                    minimumFractionDigits: 2,
                                                },
                                            )}
                                            className="flex-1 rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                        />

                                        <div className="rounded-md border-0 px-3 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:text-sm sm:leading-6 outline-none">
                                            <select
                                                id="currency"
                                                className="w-full border-none text-sm text-zinc-700 outline-none"
                                                {...register("currency")}
                                            >
                                                {currencyTypes?.map((c) => (
                                                    <option
                                                        key={c.key}
                                                        value={c.key}
                                                    >
                                                        {c.name +
                                                            " (" +
                                                            c.symbol +
                                                            ")"}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2 items-center">
                                    <label
                                        htmlFor="cusName"
                                        className="font-medium after:content-['*'] after:ml-0.5"
                                    >
                                        Müşteri Adı
                                    </label>
                                    <input
                                        type="text"
                                        id="cusName"
                                        placeholder="Müşteri seçimi yapılmayacaksa bu alanı doldurunuz!"
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                        {...register("cusName", {
                                            maxLength: 250,
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
                                        htmlFor="subDealerId"
                                        className="font-medium"
                                    >
                                        Alt Bayi
                                    </label>
                                    <Controller
                                        control={control}
                                        name="subDealerId"
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
                                        htmlFor="supplierId"
                                        className="font-medium"
                                    >
                                        Tedarikçi
                                    </label>
                                    <Controller
                                        control={control}
                                        name="supplierId"
                                        render={({
                                            field: { onChange, value },
                                        }) => (
                                            <AutoComplete
                                                onChange={onChange}
                                                value={value}
                                                data={suppliers || []}
                                                className="md:col-span-2 xl:col-span-1 my-1 sm:my-0"
                                            />
                                        )}
                                    />
                                </div>

                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                    <label
                                        htmlFor="address"
                                        className="font-medium"
                                    >
                                        Sevk Adresi
                                    </label>
                                    <textarea
                                        id="address"
                                        rows={4}
                                        className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                        {...register("address", {
                                            maxLength: 500,
                                        })}
                                    />
                                </div>

                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                    <label
                                        htmlFor="note"
                                        className="font-medium"
                                    >
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
                                    table="orders"
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

            <Modal
                isOpen={isOpenApp}
                onOpenChange={onOpenChangeApp}
                size="lg"
                placement="center"
                backdrop="opaque"
                shadow="lg"
                isDismissable={false}
                scrollBehavior="outside"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-zinc-500">
                        Cihaz Seç
                    </ModalHeader>
                    <ModalBody className="flex w-full">
                        <div>
                            <label
                                htmlFor="product"
                                className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                            >
                                Ürün
                            </label>
                            <AutoComplete
                                onChange={async (e) => {
                                    const appliances: ListBoxItem[] =
                                        await getAppliances(true, e, [
                                            "stock",
                                            "order",
                                        ]);
                                    setAppliances(appliances);
                                }}
                                data={products || []}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="applianceId"
                                className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
                            >
                                Cihaz
                            </label>
                            <span className="flex flex-row font-normal text-xs text-zinc-400 items-center gap-1 mb-1">
                                <BiInfoCircle />
                                Cihaz seçmek için ürün seçimi yapmanız
                                gereklidir!
                            </span>
                            <AutoComplete
                                onChange={(data) => setApplianceId(data)}
                                data={appliances || []}
                            />
                        </div>

                        <div className="flex flex-row gap-2 mt-4">
                            <div className="flex-1"></div>
                            <Button variant="bordered" onPress={onCloseApp}>
                                Kapat
                            </Button>
                            <Button
                                color="success"
                                className="text-white bg-sky-500"
                                isLoading={submitting}
                                onPress={() => {
                                    if (!applianceId) return;
                                    setSubmitting(true);
                                    fetch(
                                        `/api/order/${params.id}/appliance?applianceId=${applianceId}`,
                                        {
                                            method: "PUT",
                                        },
                                    )
                                        .then(async (res) => {
                                            const result = await res.json();
                                            if (result.ok) {
                                                toast.success(result.message);
                                            } else {
                                                toast.error(result.message);
                                            }
                                        })
                                        .finally(() => {
                                            mutate();
                                            onCloseApp();
                                            setSubmitting(false);
                                        });
                                }}
                            >
                                Seç
                            </Button>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>

            <Modal
                isOpen={isOpenLicense}
                onOpenChange={onOpenChangeLicense}
                size="lg"
                placement="center"
                backdrop="opaque"
                shadow="lg"
                isDismissable={false}
                scrollBehavior="outside"
            >
                <ModalContent>
                    <ModalHeader>Lisans Seç</ModalHeader>

                    <ModalBody className="flex w-full">
                        <div>
                            <label
                                htmlFor="licenseType"
                                className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                            >
                                Lisans Tipi
                            </label>
                            <AutoComplete
                                onChange={async (e) => {
                                    const licenses: ListBoxItem[] =
                                        await getLicenses(true, e, [
                                            "stock",
                                            "order",
                                        ]);
                                    setLicenses(licenses);
                                }}
                                data={licenseTypes || []}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="licenseId"
                                className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
                            >
                                Lisans
                            </label>
                            <span className="flex flex-row font-normal text-xs text-zinc-400 items-center gap-1 mb-1">
                                <BiInfoCircle />
                                Lisans seçmek için lisans tipi seçimi yapmanız
                                gereklidir!
                            </span>
                            <AutoComplete
                                onChange={(data) => setLicenseId(data)}
                                data={licenses || []}
                            />
                        </div>

                        <div className="flex flex-row gap-2 mt-4">
                            <div className="flex-1"></div>
                            <Button variant="bordered" onPress={onCloseLicense}>
                                Kapat
                            </Button>
                            <Button
                                color="success"
                                className="text-white bg-green-600"
                                isLoading={submitting}
                                onPress={() => {
                                    setSubmitting(true);
                                    fetch(
                                        `/api/order/${params.id}/license?licenseId=${licenseId}`,
                                        {
                                            method: "PUT",
                                        },
                                    )
                                        .then(async (res) => {
                                            const result = await res.json();
                                            if (result.ok) {
                                                toast.success(result.message);
                                            } else {
                                                toast.error(result.message);
                                            }
                                        })
                                        .finally(() => {
                                            mutate();
                                            onCloseLicense();
                                            setSubmitting(false);
                                        });
                                }}
                            >
                                Seç
                            </Button>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
