"use client";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
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
import SetupButton from "@/components/buttons/SetupButton";

import {
    BiInfoCircle,
    BiLinkExternal,
    BiSave,
    BiSolidCheckShield,
    BiSolidServer,
    BiSolidShieldPlus,
    BiTrash,
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
    getUsers,
    getBoughtTypes,
} from "@/lib/data";
import { currencyTypes, orderStatus } from "@/lib/constants";
import { Tooltip } from "@heroui/tooltip";
import { DateToForm } from "@/utils/date";
import PriceInput from "@/components/PriceInput";
import { cn } from "@heroui/react";

interface IFormInput {
    status: "order" | "invoice" | "purchase" | "complete";
    type: "standard" | "license";
    registerNo?: string;
    invoiceNo?: string;
    paymentPlan?: string;
    boughtAt?: string;
    soldAt?: string;
    licenseSerialNo?: string;
    licenseTypeId?: number;
    licenseStartDate?: string;
    licenseExpiryDate?: string;
    licenseProductId?: number;
    licenseAppSerialNo?: string;
    licenseBoughtTypeId?: number;
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
    invoiceCurrentId?: number;
    updatedBy: string;
    invoiceUserId?: number;
    salesUserId?: number;
    licenseUserId?: number;
    customer?: Current;
    dealer?: Current;
    subDealer?: Current;
    supplier?: Current;
    appliance?: Appliance;
    license?: License;
    invoiceCurrent?: Current;
}

interface ILicenseFormInput {
    serialNo: string;
    startDate: string;
    expiryDate: string;
    boughtTypeId: number | undefined;
    boughtAt: string;
    soldAt: string;
    orderedAt?: string;
    note?: string;
    applianceId: number;
    appSerialNo: string;
    productId?: number;
    licenseTypeId: number;
    customerId: number;
    cusName: string;
    dealerId: number;
    subDealerId: number;
    supplierId: number;
    invoiceCurrentId: number;
    createdBy: string;
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
    const [users, setUsers] = useState<ListBoxItem[] | null>(null);

    const [boughtTypes, setBoughtTypes] = useState<ListBoxItem[] | null>(null);
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
    const {
        isOpen: isOpenNewLicense,
        onClose: onCloseNewLicense,
        onOpen: onOpenNewLicense,
        onOpenChange: onOpenChangeNewLicense,
    } = useDisclosure();

    const { data, error, isLoading, mutate } = useSWR(
        `/api/order/${params.id}`,
        null,
        {
            revalidateOnFocus: false,
            onError: (err) => {
                toast.error(err.message);
            },
            onSuccess: (ord) => {
                reset(ord);
                console.log(ord);

                setValue("boughtAt", DateToForm(ord.boughtAt));
                setValue("soldAt", DateToForm(ord.soldAt));

                setValue("licenseSerialNo", ord.license?.serialNo);
                setValue("licenseTypeId", ord.license?.licenseTypeId);
                setValue(
                    "licenseStartDate",
                    DateToForm(ord.license?.startDate),
                );
                setValue(
                    "licenseExpiryDate",
                    DateToForm(ord.license?.expiryDate),
                );
                setValue("licenseProductId", ord.license?.productId);
                setValue("licenseAppSerialNo", ord.license?.appSerialNo);
                setValue("licenseBoughtTypeId", ord.license?.boughtTypeId);

                setTotalPrice(
                    parseFloat(ord.appliancePrice || 0) +
                        parseFloat(ord.licensePrice || 0),
                );
            },
        },
    );

    //#region Form
    const { register, reset, setValue, getValues, handleSubmit, control } =
        useForm<IFormInput>();

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setSubmitting(true);
        data.updatedBy = currUser?.username ?? "";

        delete data["appliance"];
        delete data["license"];
        delete data["customer"];
        delete data["dealer"];
        delete data["subDealer"];
        delete data["supplier"];
        delete data["invoiceCurrent"];

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

    const {
        register: licenseRegister,
        reset: licenseReset,
        handleSubmit: licenseHandleSubmit,
        control: licenseControl,
    } = useForm<ILicenseFormInput>();

    const onSubmitNewLicense: SubmitHandler<ILicenseFormInput> = async (
        data,
    ) => {
        setSubmitting(true);
        data.createdBy = currUser?.username ?? "";
        data.boughtTypeId = Number(data.boughtTypeId || undefined);
        data.productId = Number(data.productId || undefined);

        await fetch("/api/license", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        }).then(async (res) => {
            const result = await res.json();
            if (result.ok) {
                await fetch(
                    `/api/order/${params.id}/license?licenseId=${result.data.id}`,
                    {
                        method: "PUT",
                    },
                );

                toast.success(result.message);
                onCloseNewLicense();
                licenseReset();
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
        const pro: ListBoxItem[] = await getProducts(true);
        setProducts(pro);
        const lt: ListBoxItem[] = await getLicenseTypes(true);
        setLicenseTypes(lt);
        const cus: ListBoxItem[] = await getCustomers(true);
        setCustomers(cus);
        const dea: ListBoxItem[] = await getDealers(true);
        setDealers(dea);
        const sup: ListBoxItem[] = await getSuppliers(true);
        setSuppliers(sup);
        const users: ListBoxItem[] = await getUsers(true);
        setUsers(users);
        const bou: ListBoxItem[] = await getBoughtTypes(true);
        setBoughtTypes(bou);
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
            <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-row col-span-2 gap-2 m-2 p-1 items-center">
                    <p className="text-2xl font-bold text-sky-500">
                        {data.registerNo || ""}
                    </p>

                    <div className="flex-1"></div>

                    {currUser?.role === "technical" ? (
                        <></>
                    ) : (
                        <>
                            <RegInfo
                                data={data}
                                trigger={
                                    <Button
                                        type="button"
                                        color="primary"
                                        className="bg-sky-500"
                                        radius="sm"
                                        isIconOnly
                                    >
                                        <BiInfoCircle className="text-xl" />
                                    </Button>
                                }
                            />

                            <SetupButton
                                type={
                                    data.type === "standard"
                                        ? "appliance"
                                        : "license"
                                }
                                entityId={
                                    data.type === "standard"
                                        ? data.applianceId
                                        : data.licenseId
                                }
                            />

                            <DeleteButton
                                table="orders"
                                data={data}
                                mutate={mutate}
                                router={router}
                                trigger={
                                    <Button
                                        type="button"
                                        color="primary"
                                        className="bg-red-500"
                                        radius="sm"
                                        isIconOnly
                                    >
                                        <BiTrash className="text-xl" />
                                    </Button>
                                }
                            />

                            <Tooltip content="Kaydet">
                                <Button
                                    type="submit"
                                    color="primary"
                                    className="text-white bg-green-600"
                                    radius="sm"
                                    isLoading={submitting}
                                    isIconOnly
                                >
                                    <BiSave className="text-xl" />
                                </Button>
                            </Tooltip>
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="col-span-1 grid grid-cols-1 gap-2 h-min">
                        <Card className="col-span-1">
                            <CardHeader className="flex gap-2">
                                <p className="text-xl font-semibold text-sky-500">
                                    Sipariş Bilgileri
                                </p>
                            </CardHeader>

                            <CardBody className="gap-3">
                                <div className="divide-y divide-zinc-200">
                                    <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 p-2 items-center">
                                        <label className="font-medium">
                                            Sipariş Tipi
                                        </label>
                                        <p>
                                            {data.type === "license"
                                                ? "Lisans"
                                                : "Standart (Cihazlı)"}
                                        </p>
                                    </div>

                                    <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
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

                                    <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
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

                                    <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
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

                                    <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
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
                                                className="w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                            />

                                            <div className="min-w-24 rounded-md border-0 px-3 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:text-sm sm:leading-6 outline-none">
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

                                    <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                        <label
                                            htmlFor="boughtAt"
                                            className="font-medium"
                                        >
                                            Alım Tarihi
                                        </label>
                                        <input
                                            type="date"
                                            id="boughtAt"
                                            className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                            {...register("boughtAt")}
                                        />
                                    </div>

                                    <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
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
                                </div>
                            </CardBody>
                        </Card>

                        <Card className="col-span-1">
                            <CardHeader className="flex gap-2">
                                <p className="text-xl font-semibold text-sky-500">
                                    Cari Bilgileri
                                </p>
                            </CardHeader>

                            <CardBody className="gap-3">
                                <div className="divide-y divide-zinc-200">
                                    <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
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

                                    <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
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
                                            className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                            {...register("cusName", {
                                                maxLength: 250,
                                            })}
                                        />
                                    </div>

                                    <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
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

                                    <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
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
                                                    onChange={async (e) => {
                                                        onChange(e);
                                                        await fetch(
                                                            `/api/current/${e}/paymentPlan`,
                                                        )
                                                            .then((res) =>
                                                                res.json(),
                                                            )
                                                            .then((res) => {
                                                                setValue(
                                                                    "paymentPlan",
                                                                    res,
                                                                );
                                                            });
                                                    }}
                                                    value={value}
                                                    data={dealers || []}
                                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0"
                                                />
                                            )}
                                        />
                                    </div>

                                    <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
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

                                    <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
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

                                    <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                        <label
                                            htmlFor="invoiceCurrentId"
                                            className="font-medium"
                                        >
                                            Fatura Adresi
                                        </label>
                                        <Controller
                                            control={control}
                                            name="invoiceCurrentId"
                                            render={({
                                                field: { onChange, value },
                                            }) => (
                                                <AutoComplete
                                                    onChange={onChange}
                                                    value={value}
                                                    data={[
                                                        ...(customers || []),
                                                        ...(dealers || []),
                                                    ]}
                                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0"
                                                />
                                            )}
                                        />
                                    </div>

                                    <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
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
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    <div className="col-span-1 grid grid-cols-1 gap-2 h-min">
                        <Card className="col-span-1 max-h-fit">
                            <CardHeader className="pb-0">
                                <p className="text-xl font-semibold text-sky-500">
                                    Not
                                </p>
                            </CardHeader>
                            <CardBody>
                                <div className="w-full py-1 px-2">
                                    <textarea
                                        id="note"
                                        rows={5}
                                        className="my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                        {...register("note", {
                                            maxLength: 500,
                                        })}
                                    />
                                </div>
                            </CardBody>
                        </Card>

                        <Card
                            className={cn(
                                data.type === "standard"
                                    ? "order-2"
                                    : "order-3",
                                "col-span-1 max-h-fit",
                            )}
                        >
                            <CardHeader className="flex gap-2">
                                <p className="text-xl font-semibold text-sky-500">
                                    Cihaz Bilgileri
                                </p>

                                <div className="flex-1"></div>

                                {((data.type === "standard" &&
                                    data.applianceId) ||
                                    data.license?.applianceId) && (
                                    <Tooltip content="Cihaza Git">
                                        <Button
                                            type="button"
                                            color="primary"
                                            className="bg-yellow-500 rounded-md"
                                            radius="sm"
                                            isIconOnly
                                            onPress={() =>
                                                router.push(
                                                    `/dashboard/appliances/${
                                                        data.applianceId ||
                                                        data.license
                                                            ?.applianceId
                                                    }`,
                                                )
                                            }
                                        >
                                            <BiLinkExternal className="size-5" />
                                        </Button>
                                    </Tooltip>
                                )}

                                {data.type === "standard" && (
                                    <Tooltip content="Cihaz Seç">
                                        <Button
                                            type="button"
                                            color="primary"
                                            className="bg-sky-500 rounded-md"
                                            radius="sm"
                                            isIconOnly
                                            onPress={onOpenApp}
                                        >
                                            <BiSolidServer className="size-5" />
                                        </Button>
                                    </Tooltip>
                                )}
                            </CardHeader>

                            <CardBody className="gap-3">
                                <div className="divide-y divide-zinc-200">
                                    {data.type === "standard" ||
                                    data.license?.applianceId ? (
                                        <>
                                            <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                                <label className="font-medium">
                                                    Cihaz Seri No
                                                </label>
                                                <input
                                                    disabled
                                                    type="text"
                                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                                    value={
                                                        data.appliance
                                                            ?.serialNo ||
                                                        data.license?.appliance
                                                            ?.serialNo
                                                    }
                                                />
                                            </div>

                                            <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
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
                                                                        data
                                                                            .appliance
                                                                            ?.productId ||
                                                                    data.license
                                                                        ?.appliance
                                                                        ?.productId,
                                                            )?.name || ""
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                                <label
                                                    htmlFor="appliancePrice"
                                                    className="font-medium"
                                                >
                                                    Cihaz Fiyatı
                                                </label>
                                                <div className="flex flex-row md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full h-10 gap-1">
                                                    <Controller
                                                        control={control}
                                                        name="appliancePrice"
                                                        render={({
                                                            field: {
                                                                onChange,
                                                                value,
                                                            },
                                                        }) => (
                                                            <PriceInput
                                                                value={value}
                                                                onChange={
                                                                    onChange
                                                                }
                                                                className="flex-1 rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                                            />
                                                        )}
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
                                        </>
                                    ) : (
                                        <>
                                            <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                                <label
                                                    htmlFor="licenseProductId"
                                                    className="font-medium"
                                                >
                                                    Ürün (Lisans Üzerinden)
                                                </label>
                                                <Controller
                                                    control={control}
                                                    name="licenseProductId"
                                                    render={({
                                                        field: {
                                                            onChange,
                                                            value,
                                                        },
                                                    }) => (
                                                        <AutoComplete
                                                            onChange={onChange}
                                                            value={value}
                                                            data={
                                                                products || []
                                                            }
                                                            className="md:col-span-2 xl:col-span-1 my-1 sm:my-0"
                                                        />
                                                    )}
                                                />
                                            </div>

                                            <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                                <label
                                                    htmlFor="licenseAppSerialNo"
                                                    className="font-medium"
                                                >
                                                    Cihaz Seri No (Lisans
                                                    Üzerinden)
                                                </label>
                                                <input
                                                    type="text"
                                                    id="licenseAppSerialNo"
                                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                                    {...register(
                                                        "licenseAppSerialNo",
                                                    )}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </CardBody>
                        </Card>

                        <Card
                            className={cn(
                                data.type === "standard"
                                    ? "order-3"
                                    : "order-2",
                                "col-span-1 max-h-fit",
                            )}
                        >
                            <CardHeader className="flex gap-2">
                                <p className="text-xl font-semibold text-sky-500">
                                    Lisans Bilgileri
                                </p>

                                <div className="flex-1"></div>

                                {data.licenseId && (
                                    <Tooltip content="Lisans Git">
                                        <Button
                                            type="button"
                                            color="primary"
                                            className="bg-yellow-500 rounded-md"
                                            radius="sm"
                                            isIconOnly
                                            onPress={() =>
                                                router.push(
                                                    `/dashboard/licenses/${data.licenseId}`,
                                                )
                                            }
                                        >
                                            <BiLinkExternal className="size-5" />
                                        </Button>
                                    </Tooltip>
                                )}

                                {/* {data.type === "license" && (
                                    <Tooltip content="Cihazı Manuel Olarak Gir">
                                        <Button
                                            type="button"
                                            color="primary"
                                            className="text-white bg-zinc-400 rounded-md"
                                            radius="sm"
                                            isIconOnly
                                            onPress={() =>
                                                router.push(
                                                    `/dashboard/appliances/${data.applianceId}`,
                                                )
                                            }
                                        >
                                            <BiEditAlt className="size-5" />
                                        </Button>
                                    </Tooltip>
                                )} */}
                                {!data.licenseId && (
                                    <>
                                        <Tooltip content="Yeni Lisans Oluştur">
                                            <Button
                                                type="button"
                                                color="primary"
                                                className="text-white bg-sky-500 rounded-md"
                                                radius="sm"
                                                isIconOnly
                                                onPress={onOpenNewLicense}
                                            >
                                                <BiSolidShieldPlus className="size-5" />
                                            </Button>
                                        </Tooltip>
                                    </>
                                )}

                                <Tooltip content="Lisans Seç">
                                    <Button
                                        type="button"
                                        color="primary"
                                        className="bg-green-600 rounded-md"
                                        radius="sm"
                                        isIconOnly
                                        onPress={onOpenLicense}
                                    >
                                        <BiSolidCheckShield className="size-5" />
                                    </Button>
                                </Tooltip>
                            </CardHeader>

                            <CardBody className="gap-3">
                                {data.type === "license" &&
                                    data.license?.applianceId && (
                                        <p className="flex flex-row text-sm items-center gap-3 text-zinc-500">
                                            <BiInfoCircle className="size-5 min-w-max text-red-500" />
                                            Bu lisans bir cihaza tanımlanmıştır!
                                            Yeni sipariş oluşturmak için lisans
                                            üzerinden yeni satın alım yapınız.
                                            Aksi takdirde eski lisans bilgileri
                                            &quot;Geçmiş Lisans Bilgileri&quot;
                                            kısmına kaydedilmeyecektir.
                                        </p>
                                    )}

                                <div className="divide-y divide-zinc-200">
                                    {data.licenseId && (
                                        <>
                                            <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                                <label
                                                    htmlFor="licenseSerialNo"
                                                    className="font-medium"
                                                >
                                                    Lisans Seri No
                                                </label>
                                                <input
                                                    disabled={!data.licenseId}
                                                    type="text"
                                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                                    {...register(
                                                        "licenseSerialNo",
                                                        {
                                                            maxLength: 50,
                                                        },
                                                    )}
                                                />
                                            </div>

                                            <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                                <label
                                                    htmlFor="licenseTypeId"
                                                    className="font-medium"
                                                >
                                                    Lisans Tipi
                                                </label>
                                                <Controller
                                                    control={control}
                                                    name="licenseTypeId"
                                                    rules={{ required: true }}
                                                    render={({
                                                        field: {
                                                            onChange,
                                                            value,
                                                        },
                                                    }) => (
                                                        <AutoComplete
                                                            onChange={onChange}
                                                            value={value}
                                                            data={
                                                                licenseTypes ||
                                                                []
                                                            }
                                                            className="md:col-span-2 xl:col-span-1 my-1 sm:my-0"
                                                        />
                                                    )}
                                                />
                                            </div>

                                            <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                                <label
                                                    htmlFor="licenseBoughtTypeId"
                                                    className="font-medium"
                                                >
                                                    Alım Tipi
                                                </label>
                                                <div className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full h-10 rounded-md border-0 px-3 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2">
                                                    <select
                                                        id="licenseBoughtTypeId"
                                                        className="w-full border-none text-sm text-zinc-700 outline-none"
                                                        {...register(
                                                            "licenseBoughtTypeId",
                                                        )}
                                                    >
                                                        <option
                                                            value={undefined}
                                                        ></option>
                                                        {boughtTypes?.map(
                                                            (bt) => (
                                                                <option
                                                                    key={bt.id}
                                                                    value={
                                                                        bt.id
                                                                    }
                                                                >
                                                                    {bt.name}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                        <label
                                            htmlFor="licenseStartDate"
                                            className="font-medium"
                                        >
                                            Başlangıç Tarihi
                                        </label>
                                        <input
                                            disabled={!data.licenseId}
                                            type="date"
                                            id="licenseStartDate"
                                            className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                            {...register("licenseStartDate")}
                                        />
                                    </div>

                                    <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                        <label
                                            htmlFor="licenseExpiryDate"
                                            className="font-medium"
                                        >
                                            Bitiş Tarihi
                                        </label>
                                        <input
                                            disabled={!data.licenseId}
                                            type="date"
                                            id="licenseExpiryDate"
                                            className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                            {...register("licenseExpiryDate")}
                                        />
                                    </div>

                                    <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                        <label
                                            htmlFor="licensePrice"
                                            className="font-medium"
                                        >
                                            Lisans Fiyatı
                                        </label>
                                        <div className="flex flex-row md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full h-10 gap-1">
                                            <Controller
                                                control={control}
                                                name="licensePrice"
                                                render={({
                                                    field: { onChange, value },
                                                }) => (
                                                    <PriceInput
                                                        value={value}
                                                        onChange={onChange}
                                                        className="flex-1 rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                                    />
                                                )}
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
                                </div>
                            </CardBody>
                        </Card>

                        <Card className="col-span-1 max-h-fit order-4">
                            <CardHeader className="pb-0">
                                <p className="text-xl font-semibold text-sky-500">
                                    Atanan Kullanıcılar
                                </p>
                            </CardHeader>
                            <CardBody className="gap-3">
                                <div className="divide-y divide-zinc-200">
                                    <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                        <label
                                            htmlFor="invoiceUserId"
                                            className="font-medium"
                                        >
                                            Fatura
                                        </label>
                                        <Controller
                                            control={control}
                                            name="invoiceUserId"
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

                                    <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                        <label
                                            htmlFor="salesUserId"
                                            className="font-medium"
                                        >
                                            Satın Alım
                                        </label>
                                        <Controller
                                            control={control}
                                            name="salesUserId"
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

                                    <div className="md:grid md:grid-cols-2 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                        <label
                                            htmlFor="licenseUserId"
                                            className="font-medium"
                                        >
                                            Lisans
                                        </label>
                                        <Controller
                                            control={control}
                                            name="licenseUserId"
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
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </form>

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
                                className="block text-sm font-semibold leading-6 text-zinc-500"
                            >
                                Ürün (Model)
                            </label>
                            <span className="flex flex-row font-normal text-xs text-zinc-400 items-center gap-1 mb-1">
                                <BiInfoCircle className="text-lg" />
                                Cihazların filtrelenmesi için ürün (model)
                                seçimi yapmanız gerekmektedir. Ürün seçmeden
                                cihaz seri numaraları listelenmez!
                            </span>
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
                                gerekmektedir!
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
                                className="block text-sm font-semibold leading-6 text-zinc-500"
                            >
                                Lisans Tipi
                            </label>
                            <span className="flex flex-row font-normal text-xs text-zinc-400 items-center gap-1 mb-1">
                                <BiInfoCircle className="text-lg" />
                                Lisansların filtrelenmesi için lisans tipi
                                seçimi yapmanız gerekmektedir. Lisans tipi
                                seçmeden lisanslar listelenmez!
                            </span>
                            <AutoComplete
                                onChange={async (e) => {
                                    const licenses: ListBoxItem[] =
                                        await getLicenses(true, e, [
                                            "stock",
                                            "order",
                                            "waiting",
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
                                gerekmektedir!
                            </span>
                            <AutoComplete
                                onChange={(data) => setLicenseId(data)}
                                data={licenses || []}
                            />
                        </div>

                        <div className="flex flex-row gap-2 mt-4">
                            <div className="flex-1"></div>
                            <Button
                                type="button"
                                variant="bordered"
                                onPress={onCloseLicense}
                            >
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

            <Modal
                isOpen={isOpenNewLicense}
                onOpenChange={onOpenChangeNewLicense}
                size="xl"
                placement="center"
                backdrop="opaque"
                shadow="lg"
                isDismissable={false}
                scrollBehavior="outside"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-zinc-500">
                        Yeni Lisans
                    </ModalHeader>
                    <ModalBody>
                        <form
                            autoComplete="off"
                            className="flex flex-col gap-2"
                            onSubmit={licenseHandleSubmit(onSubmitNewLicense)}
                        >
                            <div className="relative flex items-center mt-6">
                                <div className="flex-grow border-t border-zinc-200"></div>
                                <span className="flex-shrink mx-4 text-base text-zinc-500">
                                    Lisans Bilgileri
                                </span>
                                <div className="flex-grow border-t border-zinc-200"></div>
                            </div>

                            <div>
                                <label
                                    htmlFor="licenseTypeId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2 after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Lisans Tipi
                                </label>
                                <Controller
                                    control={licenseControl}
                                    name="licenseTypeId"
                                    rules={{ required: true }}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <AutoComplete
                                            onChange={onChange}
                                            value={value}
                                            data={licenseTypes || []}
                                        />
                                    )}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="serialNo"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                                >
                                    Lisans Seri Numarası
                                </label>
                                <input
                                    type="text"
                                    id="serialNo"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...licenseRegister("serialNo", {
                                        maxLength: 50,
                                    })}
                                />
                            </div>

                            <div className="relative flex items-center mt-6">
                                <div className="flex-grow border-t border-zinc-200"></div>
                                <span className="flex-shrink mx-4 text-base text-zinc-500">
                                    Alım ve Satış Bilgileri
                                </span>
                                <div className="flex-grow border-t border-zinc-200"></div>
                            </div>

                            <div>
                                <label
                                    htmlFor="boughtTypeId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                                >
                                    Alım Tipi
                                </label>
                                <div className="block w-full h-10 rounded-md border-0 px-3 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:text-sm sm:leading-6 outline-none">
                                    <select
                                        id="boughtTypeId"
                                        className="w-full border-none text-sm text-zinc-700 outline-none"
                                        {...licenseRegister("boughtTypeId")}
                                    >
                                        <option selected value="">
                                            Satın alım tipi Seçiniz...
                                        </option>
                                        {boughtTypes?.map((bt) => (
                                            <option key={bt.id} value={bt.id}>
                                                {bt.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="orderedAt"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                                >
                                    Sipariş Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="orderedAt"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...licenseRegister("orderedAt")}
                                />
                            </div>

                            <div className="relative flex items-center mt-6">
                                <div className="flex-grow border-t border-zinc-200"></div>
                            </div>

                            <div>
                                <label
                                    htmlFor="note"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                                >
                                    Not
                                </label>
                                <div className="mt-2">
                                    <textarea
                                        id="note"
                                        rows={3}
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                        {...licenseRegister("note", {
                                            maxLength: 500,
                                        })}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-row gap-2 mt-4">
                                <div className="flex-1"></div>
                                <Button
                                    type="button"
                                    variant="bordered"
                                    onPress={onCloseNewLicense}
                                >
                                    Kapat
                                </Button>
                                <Button
                                    type="submit"
                                    color="success"
                                    className="text-white bg-green-600"
                                    isLoading={submitting}
                                >
                                    Kaydet
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
