"use client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

import { Card, CardBody, CardHeader } from "@heroui/card";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
} from "@heroui/modal";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Button } from "@heroui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Tab, Tabs } from "@heroui/tabs";
import { Tooltip } from "@heroui/tooltip";

import Skeleton, { DefaultSkeleton } from "@/components/loaders/Skeleton";
import AutoComplete from "@/components/AutoComplete";
import RegInfo from "@/components/buttons/RegInfo";
import DeleteButton from "@/components/buttons/DeleteButton";
import ApplianceForm from "@/components/ApplianceForm";
import SendLicenseMail from "@/components/buttons/SendLicenseMail";
import SetupButton from "@/components/buttons/SetupButton";
import OrderButton from "@/components/buttons/OrderButton";

import {
    BiChevronLeft,
    BiInfoCircle,
    BiPlus,
    BiServer,
    BiShieldQuarter,
    BiTrash,
    BiEdit,
    BiSolidError,
    BiSolidCheckCircle,
    BiMailSend,
    BiShow,
    BiSave,
    BiShoppingBag,
    BiFile,
} from "react-icons/bi";
import { setLicenseActiveStatus, setLicenseAppliance } from "@/lib/prisma";
import { DateFormat, DateTimeFormat, DateToForm } from "@/utils/date";
import useUserStore from "@/store/user";
import {
    getAppliances,
    getProducts,
    getLicenseTypes,
    getCustomers,
    getDealers,
    getSuppliers,
    getBoughtTypes,
} from "@/lib/data";

interface IFormInput {
    id: number;
    serialNo: string;
    startDate?: string;
    expiryDate?: string;
    boughtTypeId: number;
    boughtAt?: string;
    soldAt?: string;
    orderedAt?: string;
    note?: string;
    licenseTypeId: number;
    customerId?: number;
    cusName?: string;
    dealerId?: number;
    subDealerId?: number;
    supplierId?: number;
    invoiceCurrentId?: number;
    applianceId: number;
    updatedBy: string;
    appSerialNo?: string;
    productId?: number;
    appliance?: Appliance;
    licenseType?: LicenseType;
    boughtType?: BoughtType;
    customer?: Current;
    dealer?: Current;
    subDealer?: Current;
    supplier?: Current;
    invoiceCurrent?: Current;
    history?: LicenseHistory[];
    mailHistory?: LicenseMail[];
    product?: Product;
}

interface IHistoryFormInput {
    id: number;
    licenseId: number;
    serialNo: string;
    startDate?: string;
    expiryDate?: string;
    boughtTypeId: number;
    licenseTypeId: number;
    dealerId: number;
    subDealerId: number;
    supplierId: number;
    invoiceCurrentId: number;
    updatedBy: string;
    boughtAt?: string;
    soldAt?: string;
    orderedAt?: string;
    applianceId?: number;
    appSerialNo?: string;
    productId?: number;
    note?: string;
    licenseType?: LicenseType;
    boughtType?: BoughtType;
    dealer?: Current;
    subDealer?: Current;
    supplier?: Current;
    invoiceCurrent?: Current;
    appliance?: Appliance;
    product?: Product;
}

export default function LicenseDetail({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { user: currUser } = useUserStore();

    const [submitting, setSubmitting] = useState(false);
    const [submittingAppliance, setSubmittingAppliance] = useState(false);
    const [submittingHistory, setSubmittingHistory] = useState(false);
    const [historyIsNew, setHistoryIsNew] = useState(false);
    const {
        isOpen: isOpenApp,
        onClose: onCloseApp,
        onOpen: onOpenApp,
        onOpenChange: onOpenChangeApp,
    } = useDisclosure();
    const {
        isOpen: isOpenHistory,
        onClose: onCloseHistory,
        onOpen: onOpenHistory,
        onOpenChange: onOpenChangeHistory,
    } = useDisclosure();
    const {
        isOpen: isAppDeleteOpen,
        onClose: onAppDeleteClose,
        onOpenChange: onAppDeleteOpenChange,
    } = useDisclosure();
    const {
        isOpen: isOpenMail,
        onClose: onCloseMail,
        onOpen: onOpenMail,
        onOpenChange: onOpenChangeMail,
    } = useDisclosure();

    const [products, setProducts] = useState<ListBoxItem[] | null>(null);
    const [appliances, setAppliances] = useState<ListBoxItem[] | null>(null);
    const [licenseTypes, setLicenseTypes] = useState<ListBoxItem[] | null>(
        null,
    );
    const [boughtTypes, setBoughtTypes] = useState<ListBoxItem[] | null>(null);
    const [customers, setCustomers] = useState<ListBoxItem[] | null>(null);
    const [dealers, setDealers] = useState<ListBoxItem[] | null>(null);
    const [suppliers, setSuppliers] = useState<ListBoxItem[] | null>(null);

    const [mail, setMail] = useState<string>("");

    const { data, error, mutate } = useSWR(`/api/license/${params.id}`, null, {
        revalidateOnFocus: false,
        onSuccess: (lic) => {
            reset(lic);
            setValue("startDate", DateToForm(lic.startDate));
            setValue("expiryDate", DateToForm(lic.expiryDate));
            setValue("boughtAt", DateToForm(lic.boughtAt));
            setValue("soldAt", DateToForm(lic.soldAt));
            setValue("orderedAt", DateToForm(lic.orderedAt));
        },
    });

    //#region Form
    const { register, reset, setValue, resetField, handleSubmit, control } =
        useForm<IFormInput>();

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        if (currUser) {
            setSubmitting(true);
            data.updatedBy = currUser?.username ?? "";
            data.boughtTypeId = Number(data.boughtTypeId || undefined);
            data.productId = Number(data.productId || undefined);

            delete data["appliance"];
            delete data["licenseType"];
            delete data["boughtType"];
            delete data["customer"];
            delete data["dealer"];
            delete data["subDealer"];
            delete data["supplier"];
            delete data["history"];
            delete data["mailHistory"];
            delete data["product"];

            await fetch(`/api/license/${data.id}`, {
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
        }
    };

    const onSubmitApp: SubmitHandler<IFormInput> = async (data) => {
        if (currUser) {
            setSubmittingAppliance(true);
            const updatedBy = currUser?.username ?? "";

            const lic = await setLicenseAppliance(
                Number(params.id),
                data.applianceId,
                updatedBy,
            );
            if (lic) {
                onCloseApp();
                mutate();
                toast.success("Lisans cihaza eklendi!");
            } else toast.error("Bir hata oluştu! Lütfen tekrar deneyiniz.");

            setSubmittingAppliance(false);
        }
    };

    const {
        register: registerHistory,
        reset: resetHistory,
        resetField: resetHistoryField,
        handleSubmit: handleHistorySubmit,
        control: controlHistory,
        setValue: setHistoryValue,
    } = useForm<IHistoryFormInput>();

    const onSubmitHistory: SubmitHandler<IHistoryFormInput> = async (d) => {
        if (currUser) {
            setSubmittingHistory(true);

            const licenseWithNewHistory = {
                id: data.id,
                serialNo: d.serialNo || null,
                startDate: d.startDate || null,
                expiryDate: d.expiryDate || null,
                licenseTypeId: Number(d.licenseTypeId),
                boughtTypeId: Number(data.boughtTypeId || undefined),
                dealerId: d.dealerId && Number(d.dealerId),
                subDealerId: d.subDealerId && Number(d.subDealerId),
                supplierId: d.supplierId && Number(d.supplierId),
                updatedBy: currUser?.username ?? "",
                boughtAt: d.boughtAt || null,
                soldAt: d.soldAt || null,
                orderedAt: d.orderedAt || null,
                applianceId: d.applianceId || null,
                appSerialNo: d.appSerialNo || null,
                productId: d.productId || null,
                note: d.note || null,
                history: {
                    serialNo: data.serialNo || null,
                    startDate: data.startDate || null,
                    expiryDate: data.expiryDate || null,
                    licenseTypeId: data.licenseTypeId,
                    boughtTypeId: data.boughtTypeId || null,
                    dealerId: data.dealerId || null,
                    subDealerId: data.subDealerId || null,
                    supplierId: data.supplierId || null,
                    boughtAt: data.boughtAt || null,
                    soldAt: data.soldAt || null,
                    orderedAt: data.orderedAt || null,
                    applianceId: data.appliance?.id || null,
                    appSerialNo: data.appSerialNo || null,
                    productId: data.productId || null,
                    note: data.note || null,
                },
            };

            await fetch(`/api/license/${data.id}/history`, {
                method: "POST",
                body: JSON.stringify(licenseWithNewHistory),
                headers: { "Content-Type": "application/json" },
            }).then(async (res) => {
                const result = await res.json();
                if (result.ok) {
                    mutate();
                    resetHistory();
                    onCloseHistory();
                    toast.success(result.message);
                } else {
                    toast.error(result.message);
                }

                setSubmittingHistory(false);
                return result;
            });
        }
    };

    const onSubmitHistoryUpdate: SubmitHandler<IHistoryFormInput> = async (
        data,
    ) => {
        if (currUser) {
            setSubmittingHistory(true);
            data.updatedBy = currUser?.username ?? "";
            data.licenseTypeId = Number(data.licenseTypeId);
            data.boughtTypeId = Number(data.boughtTypeId || undefined);
            console.log(data);

            delete data["licenseType"];
            delete data["boughtType"];
            delete data["dealer"];
            delete data["subDealer"];
            delete data["supplier"];
            delete data["appliance"];
            delete data["product"];

            await fetch(`/api/license/${params.id}/history/${data.id}`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            }).then(async (res) => {
                const result = await res.json();
                if (result.ok) {
                    mutate();
                    resetHistory();
                    onCloseHistory();
                    toast.success(result.message);
                } else {
                    toast.error(result.message);
                }

                setSubmittingHistory(false);
                return result;
            });
        }
    };
    //#endregion

    //#region Data
    useEffect(() => {
        async function getData() {
            const pro: ListBoxItem[] = await getProducts(true);
            setProducts(pro);
            const app: ListBoxItem[] = await getAppliances(true);
            setAppliances(app);

            const lit: ListBoxItem[] = await getLicenseTypes(true);
            setLicenseTypes(lit);
            const bou: ListBoxItem[] = await getBoughtTypes(true);
            setBoughtTypes(bou);
            const cus: ListBoxItem[] = await getCustomers(true);
            setCustomers(cus);
            const deal: ListBoxItem[] = await getDealers(true);
            setDealers(deal);
            const sup: ListBoxItem[] = await getSuppliers(true);
            setSuppliers(sup);

            mutate();
        }

        getData();
    }, [mutate]);
    //#endregion

    if (error) return <div>Yükleme Hatası!</div>;
    if (
        !data ||
        !suppliers ||
        !dealers ||
        !customers ||
        !boughtTypes ||
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
        <div className="flex flex-col gap-2">
            <Card className="mt-4 px-1 py-2">
                <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                    <CardHeader className="flex gap-2">
                        <div className="flex items-center pb-2 pl-1">
                            <p className="text-2xl font-bold text-sky-500">
                                {data.serialNo || "Seri Numarasız Lisans"}
                            </p>
                            <div className="flex-1"></div>
                        </div>

                        <div className="flex-1"></div>

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

                        {currUser?.role !== "technical" &&
                            (data.customerId || data.cusName) && (
                                <>
                                    {data.isLost ? (
                                        <Tooltip content="Aktif Olarak İşaretle">
                                            <Button
                                                type="button"
                                                color="primary"
                                                className="bg-green-600"
                                                radius="sm"
                                                isIconOnly
                                                onPress={async () => {
                                                    await setLicenseActiveStatus(
                                                        data.id,
                                                        "active",
                                                        currUser?.username,
                                                    );
                                                    mutate();
                                                }}
                                            >
                                                <BiSolidCheckCircle className="text-xl" />
                                            </Button>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip content="Kayıp Olarak İşaretle">
                                            <Button
                                                type="button"
                                                color="primary"
                                                className="bg-red-500"
                                                radius="sm"
                                                isIconOnly
                                                onPress={async () => {
                                                    await setLicenseActiveStatus(
                                                        data.id,
                                                        "lost",
                                                        currUser?.username,
                                                    );
                                                    mutate();
                                                }}
                                            >
                                                <BiSolidError className="text-xl" />
                                            </Button>
                                        </Tooltip>
                                    )}
                                </>
                            )}

                        {currUser?.role === "technical" ? (
                            <></>
                        ) : (
                            <>
                                <SetupButton
                                    type="license"
                                    entityId={data.id}
                                />
                                
                                <OrderButton
                                    type="license"
                                    entityId={data.id}
                                    data={data}
                                />

                                <Tooltip content="Yeni Satın Alım Ekle">
                                    <Button
                                        type="button"
                                        color="primary"
                                        className="bg-yellow-500"
                                        onPress={() => {
                                            setHistoryIsNew(true);
                                            resetHistory({
                                                productId:
                                                    data.appliance?.product
                                                        ?.id || data.productId,
                                                applianceId: data.appliance?.id,
                                                appSerialNo:
                                                    data.appSerialNo || null,
                                                dealerId: data.dealerId,
                                                subDealerId: data.subDealerId,
                                                supplierId: data.supplierId,
                                                invoiceCurrentId:
                                                    data.invoiceCurrentId,
                                            });
                                            onOpenHistory();
                                        }}
                                        radius="sm"
                                        isIconOnly
                                    >
                                        <BiShoppingBag className="text-xl" />
                                    </Button>
                                </Tooltip>

                                <DeleteButton
                                    table="licenses"
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
                    </CardHeader>
                    <CardBody className="gap-3 overflow-hidden">
                        <div className="divide-y divide-zinc-200">
                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                                <dt className="font-medium">Durum</dt>
                                <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0 gap-2">
                                    {data.isLost ? (
                                        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-sm font-medium text-red-500 ring-1 ring-inset ring-red-500/20">
                                            Kayıp
                                        </span>
                                    ) : !data.customerId &&
                                      !data.cusName &&
                                      !data.orderedAt &&
                                      !data.expiryDate ? (
                                        <span className="inline-flex items-center rounded-md bg-sky-50 px-2 py-1 text-sm font-medium text-sky-500 ring-1 ring-inset ring-sky-500/20">
                                            Stok
                                        </span>
                                    ) : (data.customerId || data.cusName) &&
                                      !data.orderedAt &&
                                      !data.expiryDate ? (
                                        <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-sm font-medium text-yellow-500 ring-1 ring-inset ring-yellow-500/20">
                                            Sipariş
                                        </span>
                                    ) : (data.customerId || data.cusName) &&
                                      data.orderedAt &&
                                      !data.expiryDate ? (
                                        <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-sm font-medium text-orange-500 ring-1 ring-inset ring-orange-500/20">
                                            Bekleyen Sipariş
                                        </span>
                                    ) : (data.customerId || data.cusName) &&
                                      (data.orderedAt || data.expiryDate) ? (
                                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-green-600 ring-1 ring-inset ring-green-600/20">
                                            Aktif
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-sm font-medium text-orange-500 ring-1 ring-inset ring-orange-500/20">
                                            Belirsiz
                                        </span>
                                    )}
                                </dd>
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2 items-center">
                                {data.applianceId ? (
                                    <>
                                        <dt className="font-medium">Ürün</dt>
                                        <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                            {data?.appliance?.product?.brand
                                                ?.name +
                                                " " +
                                                data?.appliance?.product?.model}
                                        </dd>
                                    </>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2 items-center">
                                {data.applianceId ? (
                                    <>
                                        <dt className="font-medium">
                                            Cihaz Seri No
                                        </dt>
                                        <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                            {data?.appliance?.serialNo}
                                        </dd>
                                    </>
                                ) : (
                                    <>
                                        <label
                                            htmlFor="appSerialNo"
                                            className="font-medium"
                                        >
                                            Cihaz Seri No
                                        </label>
                                        <input
                                            type="text"
                                            id="appSerialNo"
                                            className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                            {...register("appSerialNo", {
                                                maxLength: 50,
                                            })}
                                        />
                                    </>
                                )}
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="licenseTypeId"
                                    className="font-medium after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Lisans Tipi
                                </label>
                                <Controller
                                    control={control}
                                    name="licenseTypeId"
                                    rules={{ required: true }}
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

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2 items-center">
                                <label
                                    htmlFor="serialNo"
                                    className="font-medium"
                                >
                                    Lisans Seri No
                                </label>
                                <input
                                    type="text"
                                    id="serialNo"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("serialNo", {
                                        maxLength: 50,
                                    })}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="startDate"
                                    className="font-medium"
                                >
                                    Başlangıç Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("startDate")}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="expiryDate"
                                    className="font-medium"
                                >
                                    Bitiş Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="expiryDate"
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("expiryDate")}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="boughtTypeId"
                                    className="font-medium"
                                >
                                    Alım Tipi
                                </label>
                                <div className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full h-10 rounded-md border-0 px-3 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2">
                                    <select
                                        id="boughtTypeId"
                                        className="w-full border-none text-sm text-zinc-700 outline-none"
                                        {...register("boughtTypeId")}
                                    >
                                        <option value={undefined}></option>
                                        {boughtTypes?.map((bt) => (
                                            <option key={bt.id} value={bt.id}>
                                                {bt.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
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

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label htmlFor="soldAt" className="font-medium">
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
                                    htmlFor="orderedAt"
                                    className="font-medium"
                                >
                                    Sipariş Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="orderedAt"
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("orderedAt")}
                                />
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
                                <div className="flex flex-row gap-1 md:col-span-2 xl:col-span-1 my-1 sm:my-0">
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
                                                className="flex-1"
                                            />
                                        )}
                                    />
                                    {currUser?.role != "technical" &&
                                    data.customerId ? (
                                        <SendLicenseMail
                                            customer={data?.customer}
                                            email={data?.customer?.email}
                                            licenseId={data?.id}
                                            licenseType={
                                                data?.licenseType?.type
                                            }
                                            appliance={
                                                data?.appliance
                                                    ? data?.appliance?.product
                                                          ?.brand?.name +
                                                      " " +
                                                      data?.appliance?.product
                                                          ?.model
                                                    : data?.product
                                                    ? data?.product?.brand
                                                          ?.name +
                                                      " " +
                                                      data?.product?.model
                                                    : null
                                            }
                                            serialNo={
                                                data?.applianceId
                                                    ? data?.appliance?.serialNo
                                                    : data?.appSerialNo
                                            }
                                            expiryDate={data?.expiryDate}
                                            mutate={mutate}
                                        />
                                    ) : null}
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="dealerId"
                                    className="font-medium"
                                >
                                    Bayi
                                </label>
                                <div className="flex flex-row gap-1 md:col-span-2 xl:col-span-1 my-1 sm:my-0">
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
                                                className="flex-1"
                                            />
                                        )}
                                    />
                                    {currUser?.role != "technical" &&
                                    data.dealerId ? (
                                        <SendLicenseMail
                                            customer={data?.customer}
                                            dealer={data?.dealer}
                                            email={data?.dealer?.email}
                                            licenseId={data?.id}
                                            licenseType={
                                                data?.licenseType?.type
                                            }
                                            appliance={
                                                data?.appliance
                                                    ? data?.appliance?.product
                                                          ?.brand?.name +
                                                      " " +
                                                      data?.appliance?.product
                                                          ?.model
                                                    : data?.product
                                                    ? data?.product?.brand
                                                          ?.name +
                                                      " " +
                                                      data?.product?.model
                                                    : null
                                            }
                                            serialNo={
                                                data?.applianceId
                                                    ? data?.appliance?.serialNo
                                                    : data?.appSerialNo
                                            }
                                            expiryDate={data?.expiryDate}
                                            mutate={mutate}
                                        />
                                    ) : null}
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="subDealerId"
                                    className="font-medium"
                                >
                                    Alt Bayi
                                </label>
                                <div className="flex flex-row gap-1 md:col-span-2 xl:col-span-1 my-1 sm:my-0">
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
                                            />
                                        )}
                                    />
                                    {currUser?.role != "technical" &&
                                    data.subDealerId ? (
                                        <SendLicenseMail
                                            customer={data?.customer}
                                            dealer={data?.subDealer}
                                            email={data?.dealer?.email}
                                            licenseId={data?.id}
                                            licenseType={
                                                data?.licenseType?.type
                                            }
                                            appliance={
                                                data?.appliance
                                                    ? data?.appliance?.product
                                                          ?.brand?.name +
                                                      " " +
                                                      data?.appliance?.product
                                                          ?.model
                                                    : data?.product
                                                    ? data?.product?.brand
                                                          ?.name +
                                                      " " +
                                                      data?.product?.model
                                                    : null
                                            }
                                            serialNo={
                                                data?.applianceId
                                                    ? data?.appliance?.serialNo
                                                    : data?.appSerialNo
                                            }
                                            expiryDate={data?.expiryDate}
                                            mutate={mutate}
                                        />
                                    ) : null}
                                </div>
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
                                        />
                                    )}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
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
                </form>
            </Card>

            <Accordion
                selectionMode="multiple"
                variant="splitted"
                defaultExpandedKeys={data.appliance ? ["appliance"] : []}
                className="!p-0"
                itemClasses={{
                    title: "font-medium text-zinc-600",
                    base: "px-4 py-3",
                }}
            >
                <AccordionItem
                    key="appliance"
                    aria-label="appliance"
                    title="Cihaz Bilgileri"
                    subtitle="Bu lisansın ait olduğu cihaz bilgileri"
                    indicator={
                        <BiChevronLeft className="text-3xl text-zinc-500" />
                    }
                    startContent={
                        <BiServer className="text-4xl text-green-600/60" />
                    }
                >
                    {data?.appliance ? (
                        <>
                            <div className="divide-y divide-zinc-200 text-zinc-500">
                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base p-2">
                                    <dt className="font-medium">Marka</dt>
                                    <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                        {data.appliance?.product?.brand?.name ||
                                            "-"}
                                    </dd>
                                </div>
                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base p-2">
                                    <dt className="font-medium">Model</dt>
                                    <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                        {data.appliance?.product?.model || "-"}
                                    </dd>
                                </div>

                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base p-2">
                                    <dt className="font-medium">Seri No</dt>
                                    <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                        {data.appliance?.serialNo || "-"}
                                    </dd>
                                </div>

                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base p-2">
                                    <dt className="font-medium">Alım Tarihi</dt>
                                    <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                        {DateFormat(data.appliance?.boughtAt) ||
                                            "-"}
                                    </dd>
                                </div>
                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base p-2">
                                    <dt className="font-medium">
                                        Satış Tarihi
                                    </dt>
                                    <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                        {DateFormat(data.appliance?.soldAt) ||
                                            "-"}
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
                                            `/dashboard/appliances/${data.appliance?.id}`,
                                        )
                                    }
                                >
                                    Cihaza Git
                                </Button>
                                {currUser?.role === "technical" ? undefined : (
                                    <>
                                        <Popover
                                            key={data.id}
                                            placement="top"
                                            color="default"
                                            backdrop="opaque"
                                            isOpen={isAppDeleteOpen}
                                            onOpenChange={onAppDeleteOpenChange}
                                        >
                                            <PopoverTrigger>
                                                <Button
                                                    color="primary"
                                                    className="bg-red-500"
                                                >
                                                    Cihazı Sil
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="flex flex-col gap-2 p-3">
                                                <h2 className="text-lg font-semibold text-zinc-600">
                                                    Seçili kayıt silinecektir!
                                                </h2>
                                                <p className="text-sm text-zinc-500 pb-2">
                                                    Devam etmek istediğinizden
                                                    emin misiniz?
                                                </p>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="bordered"
                                                        onPress={
                                                            onAppDeleteClose
                                                        }
                                                    >
                                                        Kapat
                                                    </Button>
                                                    <Button
                                                        variant="solid"
                                                        color="danger"
                                                        className="bg-red-600"
                                                        onPress={async () => {
                                                            if (currUser) {
                                                                const updatedBy =
                                                                    currUser?.username ??
                                                                    "";

                                                                const lic =
                                                                    await setLicenseAppliance(
                                                                        Number(
                                                                            params.id,
                                                                        ),
                                                                        null,
                                                                        updatedBy,
                                                                    );
                                                                if (lic) {
                                                                    onAppDeleteClose();
                                                                    mutate();
                                                                    toast.success(
                                                                        "Lisans cihazdan silindi!",
                                                                    );
                                                                } else
                                                                    toast.error(
                                                                        "Bir hata oluştu! Lütfen tekrar deneyiniz.",
                                                                    );
                                                            }
                                                        }}
                                                    >
                                                        Sil
                                                    </Button>
                                                </div>
                                            </PopoverContent>
                                        </Popover>

                                        <Button
                                            color="primary"
                                            className="bg-green-600"
                                            onPress={onOpenApp}
                                        >
                                            Cihaz Değiştir
                                        </Button>
                                    </>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="w-full py-3 text-center">
                            <p className="text-zinc-400">
                                Bu lisans herhangi bir cihaza ait değildir.
                            </p>
                            {currUser?.role === "technical" ? undefined : (
                                <Button
                                    color="primary"
                                    className="bg-sky-500 mt-3"
                                    endContent={<BiPlus />}
                                    onPress={onOpenApp}
                                >
                                    Cihaz Ekle
                                </Button>
                            )}
                        </div>
                    )}
                </AccordionItem>
            </Accordion>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <Accordion
                    selectionMode="multiple"
                    variant="splitted"
                    defaultExpandedKeys={
                        data.history.length != 0 ? ["history"] : []
                    }
                    className="!p-0"
                    itemClasses={{
                        title: "font-medium text-zinc-600",
                        base: "px-4 py-3",
                    }}
                >
                    <AccordionItem
                        key="history"
                        aria-label="history"
                        title="Geçmiş Lisans Bilgileri"
                        subtitle="Bu lisansın geçmiş satın alım bilgileri"
                        indicator={
                            <BiChevronLeft className="text-3xl text-zinc-500" />
                        }
                        startContent={
                            <BiShieldQuarter className="text-4xl text-yellow-500/60" />
                        }
                    >
                        {data.history.length > 0 ? (
                            <>
                                <ul
                                    role="list"
                                    className="divide-y divide-zinc-200"
                                >
                                    <li key={0}></li>
                                    {data.history.map((h: LicenseHistory) => (
                                        <li
                                            key={h.id}
                                            className="flex justify-between py-2 items-center"
                                        >
                                            <div className="min-w-0 flex-auto">
                                                <div className="flex flex-row gap-2 items-center">
                                                    <p className="text-sm font-semibold leading-6 text-zinc-600">
                                                        {h.licenseType?.brand
                                                            ?.name +
                                                            " " +
                                                            h.licenseType?.type}
                                                    </p>
                                                    {currUser?.role ==
                                                    "technical" ? (
                                                        <></>
                                                    ) : (
                                                        <>
                                                            <RegInfo
                                                                data={h}
                                                                trigger={
                                                                    <span>
                                                                        <BiInfoCircle />
                                                                    </span>
                                                                }
                                                            />

                                                            <BiEdit
                                                                className="text-xl text-green-600 cursor-pointer"
                                                                onClick={() => {
                                                                    setHistoryIsNew(
                                                                        false,
                                                                    );
                                                                    resetHistory(
                                                                        {
                                                                            ...h,
                                                                            startDate:
                                                                                h.startDate?.split(
                                                                                    "T",
                                                                                )[0],
                                                                            expiryDate:
                                                                                h.expiryDate?.split(
                                                                                    "T",
                                                                                )[0],
                                                                            boughtAt:
                                                                                h.boughtAt?.split(
                                                                                    "T",
                                                                                )[0],
                                                                            soldAt: h.soldAt?.split(
                                                                                "T",
                                                                            )[0],
                                                                            orderedAt:
                                                                                h.orderedAt?.split(
                                                                                    "T",
                                                                                )[0],
                                                                            productId:
                                                                                h
                                                                                    .product
                                                                                    ?.id,
                                                                            applianceId:
                                                                                h
                                                                                    .appliance
                                                                                    ?.id,
                                                                            dealerId:
                                                                                h
                                                                                    .dealer
                                                                                    ?.id,
                                                                            subDealerId:
                                                                                h
                                                                                    .subDealer
                                                                                    ?.id,
                                                                            supplierId:
                                                                                h
                                                                                    .supplier
                                                                                    ?.id,
                                                                            invoiceCurrentId:
                                                                                h
                                                                                    .invoiceCurrent
                                                                                    ?.id,
                                                                        },
                                                                    );
                                                                    onOpenHistory();
                                                                }}
                                                            />

                                                            <DeleteButton
                                                                table="licenseHistory"
                                                                data={h}
                                                                mutate={mutate}
                                                                trigger={
                                                                    <span>
                                                                        <BiTrash />
                                                                    </span>
                                                                }
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                                {h.licenseType?.duration ? (
                                                    <span className="inline-flex items-center rounded-md bg-sky-50 px-2 py-1 text-xs font-medium text-sky-600 ring-1 ring-inset ring-sky-600/20">
                                                        {h.licenseType
                                                            ?.duration + " ay"}
                                                    </span>
                                                ) : (
                                                    <> </>
                                                )}

                                                {h.boughtType ? (
                                                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-600/20 ml-2 mb-2">
                                                        {h.boughtType?.type}
                                                    </span>
                                                ) : (
                                                    <></>
                                                )}

                                                <div className="max-w-96 text-xs leading-5 text-zinc-400">
                                                    {h.serialNo ? (
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <dt className="font-semibold text-zinc-500">
                                                                Seri No:
                                                            </dt>
                                                            <dd className="truncate">
                                                                {h.serialNo}
                                                            </dd>
                                                        </div>
                                                    ) : (
                                                        <></>
                                                    )}

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <dt className="font-semibold text-zinc-500">
                                                            Başlangıç Tarihi:
                                                        </dt>
                                                        <dd>
                                                            {DateFormat(
                                                                h.startDate,
                                                            )}
                                                        </dd>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <dt className="font-semibold text-zinc-500">
                                                            Bitiş Tarihi:
                                                        </dt>
                                                        <dd>
                                                            {DateFormat(
                                                                h.expiryDate,
                                                            )}
                                                        </dd>
                                                    </div>

                                                    {h.dealer ? (
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <dt className="font-semibold text-zinc-500">
                                                                Bayi:
                                                            </dt>
                                                            <dd className="truncate">
                                                                {h.dealer.name}
                                                            </dd>
                                                        </div>
                                                    ) : (
                                                        <></>
                                                    )}

                                                    {h.subDealer ? (
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <dt className="font-semibold text-zinc-500">
                                                                Alt Bayi:
                                                            </dt>
                                                            <dd className="truncate">
                                                                {
                                                                    h.subDealer
                                                                        .name
                                                                }
                                                            </dd>
                                                        </div>
                                                    ) : (
                                                        <></>
                                                    )}

                                                    {h.supplier ? (
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <dt className="font-semibold text-zinc-500">
                                                                Tedarikçi:
                                                            </dt>
                                                            <dd className="truncate">
                                                                {
                                                                    h.supplier
                                                                        .name
                                                                }
                                                            </dd>
                                                        </div>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <div className="w-full py-6 text-center">
                                <p className="text-zinc-400">
                                    Bu lisansın geçmişte herhangi bir satın
                                    alımı bulunmuyor.
                                </p>
                            </div>
                        )}
                    </AccordionItem>
                </Accordion>

                <Accordion
                    selectionMode="multiple"
                    variant="splitted"
                    defaultExpandedKeys={
                        data?.mailHistory?.length != 0 ? ["mail"] : []
                    }
                    className="!p-0"
                    itemClasses={{
                        title: "font-medium text-zinc-600",
                        base: "px-4 py-3",
                    }}
                >
                    <AccordionItem
                        key="mail"
                        aria-label="mail"
                        title="Gönderilen Mailler"
                        subtitle="Geçmişte bu lisansa ait gönderilen mailler"
                        indicator={
                            <BiChevronLeft className="text-3xl text-zinc-500" />
                        }
                        startContent={
                            <BiMailSend className="text-4xl text-sky-500/60" />
                        }
                    >
                        {data.mailHistory.length > 0 ? (
                            <>
                                <ul
                                    role="list"
                                    className="divide-y divide-zinc-200"
                                >
                                    <li key={0}></li>
                                    {data.mailHistory.map(
                                        (mail: LicenseMail) => (
                                            <li
                                                key={mail.id}
                                                className="flex justify-between py-2 items-center"
                                            >
                                                <div className="min-w-0 flex-auto">
                                                    <div className="flex flex-row gap-2 items-center">
                                                        <p className="text-sm font-semibold leading-6 text-zinc-600">
                                                            {DateTimeFormat(
                                                                mail.createdAt,
                                                            )}
                                                        </p>

                                                        <BiShow
                                                            className="text-xl text-zinc-500 cursor-pointer"
                                                            onClick={() => {
                                                                setMail(
                                                                    mail.content ||
                                                                        "",
                                                                );
                                                                onOpenMail();
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="max-w-96 text-xs leading-5 text-zinc-400">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <dt className="font-semibold text-zinc-500">
                                                                Alıcı:
                                                            </dt>
                                                            <dd className="truncate">
                                                                {mail.to}
                                                            </dd>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <dt className="font-semibold text-zinc-500">
                                                                Gönderen
                                                                Kullanıcı:
                                                            </dt>
                                                            <dd className="truncate">
                                                                {mail.createdBy}
                                                            </dd>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </>
                        ) : (
                            <div className="w-full py-6 text-center">
                                <p className="text-zinc-400">
                                    Herhangi bir mail gönderilmedi.
                                </p>
                            </div>
                        )}
                    </AccordionItem>
                </Accordion>
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
                        Cihaz Ekleme
                    </ModalHeader>
                    <ModalBody className="flex items-center w-full">
                        <Tabs
                            aria-label="Appliance Tab"
                            color="primary"
                            size="sm"
                            classNames={{
                                cursor: "w-full bg-sky-500",
                                tab: "px-8",
                            }}
                        >
                            <Tab
                                key="registered"
                                title="Kayıtlı"
                                className="w-full"
                            >
                                <form
                                    autoComplete="off"
                                    className="flex flex-col gap-2"
                                    onSubmit={handleSubmit(onSubmitApp)}
                                >
                                    <div>
                                        <label
                                            htmlFor="product"
                                            className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                                        >
                                            Ürün
                                        </label>
                                        <AutoComplete
                                            onChange={async (e) => {
                                                resetField("applianceId");
                                                const appliances: ListBoxItem[] =
                                                    await getAppliances(
                                                        true,
                                                        e,
                                                    );
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
                                            Cihaz seçmek için ürün seçimi
                                            yapmanız gereklidir!
                                        </span>
                                        <Controller
                                            control={control}
                                            name="applianceId"
                                            rules={{ required: true }}
                                            render={({
                                                field: { onChange, value },
                                            }) => (
                                                <AutoComplete
                                                    onChange={onChange}
                                                    value={value}
                                                    data={appliances || []}
                                                />
                                            )}
                                        />
                                    </div>

                                    <div className="flex flex-row gap-2 mt-4">
                                        <div className="flex-1"></div>
                                        <Button
                                            variant="bordered"
                                            onPress={onCloseApp}
                                        >
                                            Kapat
                                        </Button>
                                        <Button
                                            type="submit"
                                            color="success"
                                            className="text-white bg-green-600"
                                            isLoading={submittingAppliance}
                                        >
                                            Kaydet
                                        </Button>
                                    </div>
                                </form>
                            </Tab>
                            <Tab key="new" title="Yeni" className="w-full">
                                <ApplianceForm
                                    license={data}
                                    onClose={onCloseApp}
                                    products={products || []}
                                    customers={customers || []}
                                    dealers={dealers || []}
                                    suppliers={suppliers || []}
                                />
                            </Tab>
                        </Tabs>
                    </ModalBody>
                </ModalContent>
            </Modal>

            <Modal
                isOpen={isOpenHistory}
                onOpenChange={onOpenChangeHistory}
                size="lg"
                placement="center"
                backdrop="opaque"
                shadow="lg"
                isDismissable={false}
                scrollBehavior="outside"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-zinc-500">
                        {historyIsNew
                            ? "Yeni Satın Alım"
                            : "Satın Alım Güncelleme"}
                    </ModalHeader>
                    <ModalBody>
                        <form
                            autoComplete="off"
                            className="flex flex-col gap-2"
                            onSubmit={
                                historyIsNew
                                    ? handleHistorySubmit(onSubmitHistory)
                                    : handleHistorySubmit(onSubmitHistoryUpdate)
                            }
                        >
                            <div className="relative flex items-center">
                                <div className="flex-grow border-t border-zinc-200"></div>
                                <span className="flex-shrink mx-4 text-base text-zinc-500">
                                    Cihaz Bilgileri
                                </span>
                                <div className="flex-grow border-t border-zinc-200"></div>
                            </div>

                            <div>
                                <label
                                    htmlFor="productId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Ürün
                                </label>
                                <Controller
                                    control={controlHistory}
                                    name="productId"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <AutoComplete
                                            value={value}
                                            data={products || []}
                                            onChange={async (e) => {
                                                onChange(e);
                                                resetHistoryField(
                                                    "applianceId",
                                                );
                                                const appliances: ListBoxItem[] =
                                                    await getAppliances(
                                                        true,
                                                        e,
                                                    );
                                                setAppliances(appliances);
                                            }}
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="applianceId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Cihaz
                                </label>
                                <span className="flex flex-row font-normal text-xs text-zinc-400 items-center gap-1 mb-1">
                                    <BiInfoCircle />
                                    Cihaz seçmek için ürün seçimi yapmanız
                                    gereklidir!
                                </span>
                                <Controller
                                    control={controlHistory}
                                    name="applianceId"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <AutoComplete
                                            value={value}
                                            data={appliances || []}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                            </div>

                            <div className="relative flex items-center mt-2">
                                <div className="flex-grow border-t border-zinc-200"></div>
                                <span className="flex-shrink mx-4 text-xs text-zinc-500">
                                    veya
                                </span>
                                <div className="flex-grow border-t border-zinc-200"></div>
                            </div>

                            <div>
                                <label
                                    htmlFor="appSerialNo"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Cihaz Seri Numarası
                                </label>
                                <input
                                    type="text"
                                    id="appSerialNo"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...registerHistory("appSerialNo", {
                                        maxLength: 50,
                                    })}
                                />
                            </div>

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
                                    className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Lisans Tipi
                                </label>
                                <Controller
                                    control={controlHistory}
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
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Lisans Seri Numarası
                                </label>
                                <input
                                    type="text"
                                    id="serialNo"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...registerHistory("serialNo", {
                                        maxLength: 50,
                                    })}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="startDate"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Başlangıç Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...registerHistory("startDate")}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="expiryDate"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Bitiş Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="expiryDate"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...registerHistory("expiryDate")}
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
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Alım Tipi
                                </label>
                                <div className="block w-full h-10 rounded-md border-0 px-3 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2">
                                    <select
                                        id="boughtTypeId"
                                        className="w-full border-none text-sm text-zinc-700 outline-none"
                                        {...registerHistory("boughtTypeId")}
                                    >
                                        <option value={undefined}></option>
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
                                    htmlFor="boughtAt"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Alım Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="boughtAt"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...registerHistory("boughtAt")}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="soldAt"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Satış Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="soldAt"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...registerHistory("soldAt")}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="orderedAt"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Sipariş Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="orderedAt"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...registerHistory("orderedAt")}
                                />
                            </div>

                            <div className="relative flex items-center mt-6">
                                <div className="flex-grow border-t border-zinc-200"></div>
                                <span className="flex-shrink mx-4 text-base text-zinc-500">
                                    Cari Bilgileri
                                </span>
                                <div className="flex-grow border-t border-zinc-200"></div>
                            </div>

                            <div>
                                <label
                                    htmlFor="dealerId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                                >
                                    Bayi
                                </label>
                                <Controller
                                    control={controlHistory}
                                    name="dealerId"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <AutoComplete
                                            onChange={onChange}
                                            value={value}
                                            data={dealers || []}
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="subDealerId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                                >
                                    Alt Bayi
                                </label>
                                <Controller
                                    control={controlHistory}
                                    name="subDealerId"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <AutoComplete
                                            onChange={onChange}
                                            value={value}
                                            data={dealers || []}
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="supplierId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                                >
                                    Tedarikçi
                                </label>
                                <Controller
                                    control={controlHistory}
                                    name="supplierId"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <AutoComplete
                                            onChange={onChange}
                                            value={value}
                                            data={suppliers || []}
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="invoiceCurrentId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                                >
                                    Fatura Adresi
                                </label>
                                <Controller
                                    control={controlHistory}
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
                                        />
                                    )}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="note"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                                >
                                    Not
                                </label>
                                <textarea
                                    id="note"
                                    rows={4}
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...registerHistory("note", {
                                        maxLength: 500,
                                    })}
                                />
                            </div>

                            <div className="flex flex-row gap-2 mt-4">
                                <div className="flex-1"></div>
                                <Button
                                    variant="bordered"
                                    onPress={onCloseHistory}
                                >
                                    Kapat
                                </Button>
                                <Button
                                    type="submit"
                                    color="success"
                                    className="text-white bg-green-600"
                                    isLoading={submittingHistory}
                                >
                                    Kaydet
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>

            <Modal
                isOpen={isOpenMail}
                onOpenChange={onOpenChangeMail}
                size="lg"
                placement="center"
                backdrop="opaque"
                shadow="md"
                isDismissable={false}
                scrollBehavior="outside"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-zinc-500">
                        Lisans Süre Dolum Maili
                    </ModalHeader>
                    <ModalBody className="flex items-center w-full">
                        <div dangerouslySetInnerHTML={{ __html: mail }} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
}
