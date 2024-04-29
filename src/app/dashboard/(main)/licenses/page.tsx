"use client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import toast from "react-hot-toast";

import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/modal";
import { Tab, Tabs } from "@nextui-org/tabs";
import { SortDescriptor } from "@nextui-org/table";
import { Button } from "@nextui-org/button";

import Skeleton, { TableSkeleton } from "@/components/loaders/Skeleton";
import DataTable from "@/components/DataTable";
import BoolChip from "@/components/BoolChip";
import IconChip from "@/components/IconChip";
import AutoComplete from "@/components/AutoComplete";
import {
    BiCheckCircle,
    BiErrorCircle,
    BiHelpCircle,
    BiInfoCircle,
} from "react-icons/bi";
import { DateFormat, DateTimeFormat } from "@/utils/date";
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
    createdBy: string;
}

export default function Licenses() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user: currUser } = useUserStore();
    const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
    const [selectedTab, setSelectedTab] = useState(() => {
        let param = searchParams.get("tab");
        if (param) return param;
        else {
            if (typeof window !== "undefined") {
                let openTabJSON = localStorage?.getItem("licensesOpenTab");

                if (openTabJSON) {
                    return JSON.parse(openTabJSON);
                } else {
                    return "stock";
                }
            }
        }
    });

    const [stockLicenses, setStockLicenses] = useState<vLicense[] | null>(null);
    const [orderLicenses, setOrderLicenses] = useState<vLicense[] | null>(null);
    const [waitingOrderLicenses, setWaitingOrderLicenses] = useState<
        vLicense[] | null
    >(null);
    const [activeLicenses, setActiveLicenses] = useState<vLicense[] | null>(
        null,
    );

    const [products, setProducts] = useState<ListBoxItem[] | null>(null);
    const [appliances, setAppliances] = useState<ListBoxItem[] | null>(null);
    const [licenseTypes, setLicenseTypes] = useState<ListBoxItem[] | null>(
        null,
    );
    const [boughtTypes, setBoughtTypes] = useState<ListBoxItem[] | null>(null);
    const [customers, setCustomers] = useState<ListBoxItem[] | null>(null);
    const [dealers, setDealers] = useState<ListBoxItem[] | null>(null);
    const [suppliers, setSuppliers] = useState<ListBoxItem[] | null>(null);

    //#region Form
    const { register, reset, resetField, handleSubmit, control } =
        useForm<IFormInput>();
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
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
                toast.success(result.message);
                onClose();
                reset();
                mutate();
            } else {
                toast.error(result.message);
            }
            return result;
        });
    };
    //#endregion

    //#region Table
    const visibleColumns = [
        "applianceSerialNo",
        "licenseType",
        "customerName",
        "dealerName",
        "subDealerId",
        "supplierName",
        "isStock",
        "boughtType",
        // "boughtAt",
        // "soldAt",
        "expiryStatus",
    ];

    const sort: SortDescriptor = {
        column: "createdAt",
        direction: "descending",
    };

    const columns: Column[] = [
        {
            key: "serialNo",
            name: "Lisans Seri Numarası",
            width: 200,
            searchable: true,
        },
        {
            key: "applianceSerialNo",
            name: "Cihaz Seri Numarası",
            width: 200,
            searchable: true,
        },
        {
            key: "product",
            name: "Ürün",
            width: 200,
            searchable: true,
        },
        {
            key: "licenseType",
            name: "Lisans Tipi",
            width: 200,
            searchable: true,
        },
        {
            key: "boughtType",
            name: "Alım Tipi",
            width: 100,
        },
        {
            key: "customerName",
            name: "Müşteri",
            width: 120,
            searchable: true,
            sortable: true,
        },
        {
            key: "dealerName",
            name: "Bayi",
            width: 120,
            searchable: true,
            sortable: true,
        },
        {
            key: "subDealerName",
            name: "Alt Bayi",
            width: 120,
            searchable: true,
            sortable: true,
        },
        {
            key: "supplierName",
            name: "Tedarikçi",
            width: 120,
            searchable: true,
            sortable: true,
        },
        {
            key: "boughtAt",
            name: "Alım Tarihi",
            width: 150,
            sortable: true,
        },
        {
            key: "soldAt",
            name: "Satış Tarihi",
            width: 150,
            sortable: true,
        },
        {
            key: "orderedAt",
            name: "Sipariş Tarihi",
            width: 150,
            sortable: true,
        },
        {
            key: "startDate",
            name: "Başlangıç Tarihi",
            width: 150,
            sortable: true,
        },
        {
            key: "expiryDate",
            name: "Bitiş Tarihi",
            width: 150,
            sortable: true,
        },
        {
            key: "expiryStatus",
            name: "Süre",
            width: 80,
        },
        {
            key: "createdBy",
            name: "Oluşturan Kullanıcı",
            width: 80,
        },
        {
            key: "createdAt",
            name: "Oluşturulma Tarihi",
            width: 150,
            sortable: true,
        },
        {
            key: "updatedBy",
            name: "Güncelleyen Kullanıcı",
            width: 80,
        },
        {
            key: "updatedAt",
            name: "Güncellenme Tarihi",
            width: 150,
            sortable: true,
        },
    ];

    const renderCell = React.useCallback(
        (license: vLicense, columnKey: React.Key) => {
            const cellValue: any = license[columnKey as keyof typeof license];

            switch (columnKey) {
                case "isStock":
                    return <BoolChip value={cellValue} />;
                case "applianceSerialNo":
                    return cellValue || license.appSerialNo || "-";
                case "customerName":
                case "dealerName":
                case "subDealerName":
                case "supplierName":
                    return (
                        <p>
                            {cellValue
                                ? cellValue.length > 40
                                    ? cellValue.substring(0, 40) + "..."
                                    : cellValue
                                : "-"}
                        </p>
                    );
                case "expiryStatus":
                    return (
                        <>
                            {!cellValue ? (
                                "-"
                            ) : cellValue == "ended" ? (
                                <IconChip
                                    icon={
                                        <BiErrorCircle className="text-xl text-red-600" />
                                    }
                                    color="bg-red-100"
                                    content="Süresi Doldu"
                                />
                            ) : cellValue == "ending" ? (
                                <IconChip
                                    icon={
                                        <BiInfoCircle className="text-xl text-yellow-600" />
                                    }
                                    color="bg-yellow-100"
                                    content="30 Günden Az Süre Kaldı"
                                />
                            ) : cellValue == "continues" ? (
                                <IconChip
                                    icon={
                                        <BiCheckCircle className="text-xl text-green-600" />
                                    }
                                    color="bg-green-100"
                                    content="Devam Ediyor"
                                />
                            ) : cellValue == "undefined" ? (
                                <IconChip
                                    icon={
                                        <BiHelpCircle className="text-xl text-zinc-600" />
                                    }
                                    color="bg-zinc-100"
                                    content="Lisans Bitiş Tarihi Girilmemiş"
                                />
                            ) : (
                                "-"
                            )}
                        </>
                    );
                case "startDate":
                case "expiryDate":
                case "boughtAt":
                case "soldAt":
                case "orderedAt":
                    return <p>{DateFormat(cellValue)}</p>;
                case "createdAt":
                case "updatedAt":
                    return <p>{DateTimeFormat(cellValue)}</p>;
                default:
                    return cellValue ? cellValue : "-";
            }
        },
        [],
    );
    //#endregion

    //#region Data
    async function getData() {
        const pro: ListBoxItem[] = await getProducts(true);
        setProducts(pro);

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
    }

    useEffect(() => {
        getData();
    }, []);
    //#endregion

    const { data, error, mutate } = useSWR("/api/license", null, {
        onSuccess: (data) => {
            setStockLicenses(
                data?.filter((l: vLicense) => l.status == "stock"),
            );
            setOrderLicenses(
                data?.filter((l: vLicense) => l.status == "order"),
            );
            setWaitingOrderLicenses(
                data?.filter((l: vLicense) => l.status == "waiting"),
            );
            setActiveLicenses(
                data?.filter((l: vLicense) => l.status == "active"),
            );
        },
    });

    if (error) return <div>Yükleme Hatası!</div>;
    if (!data) {
        return (
            <div className="flex flex-col mt-4">
                <Skeleton>
                    <TableSkeleton />
                </Skeleton>
            </div>
        );
    }
    return (
        <>
            <div className="flex flex-col w-full items-center mt-4 mb-2">
                <Tabs
                    aria-label="License Tab"
                    color="primary"
                    size="md"
                    classNames={{
                        cursor: "w-full bg-sky-500",
                        tab: "px-10",
                    }}
                    selectedKey={selectedTab}
                    onSelectionChange={(key: any) => {
                        setSelectedTab(key);

                        window.localStorage.setItem(
                            "licensesOpenTab",
                            JSON.stringify(key),
                        );
                    }}
                >
                    <Tab key="stock" title="Stok" className="w-full">
                        <DataTable
                            storageKey="stockLicenses"
                            isCompact
                            isStriped
                            emptyContent="Herhangi bir lisans bulunamadı!"
                            defaultRowsPerPage={20}
                            data={stockLicenses || []}
                            columns={columns}
                            renderCell={renderCell}
                            sortOption={sort}
                            initialVisibleColumNames={visibleColumns}
                            activeOptions={[]}
                            onAddNew={
                                currUser?.role == "technical"
                                    ? undefined
                                    : () => {
                                        reset({});
                                        onOpen();
                                    }
                            }
                            onDoubleClick={(item) => {
                                router.push(`/dashboard/licenses/${item.id}`);
                            }}
                        />
                    </Tab>
                    <Tab key="order" title="Sipariş" className="w-full">
                        <DataTable
                            storageKey="orderLicenses"
                            isCompact
                            isStriped
                            emptyContent="Herhangi bir lisans bulunamadı!"
                            defaultRowsPerPage={20}
                            data={orderLicenses || []}
                            columns={columns}
                            renderCell={renderCell}
                            sortOption={sort}
                            initialVisibleColumNames={visibleColumns}
                            activeOptions={[]}
                            onAddNew={
                                currUser?.role == "technical"
                                    ? undefined
                                    : () => {
                                        reset({});
                                        onOpen();
                                    }
                            }
                            onDoubleClick={(item) => {
                                router.push(`/dashboard/licenses/${item.id}`);
                            }}
                        />
                    </Tab>
                    <Tab
                        key="waitingOrder"
                        title="Bekleyen Sipariş"
                        className="w-full"
                    >
                        <DataTable
                            storageKey="waitingOrderLicenses"
                            isCompact
                            isStriped
                            emptyContent="Herhangi bir lisans bulunamadı!"
                            defaultRowsPerPage={20}
                            data={waitingOrderLicenses || []}
                            columns={columns}
                            renderCell={renderCell}
                            sortOption={sort}
                            initialVisibleColumNames={visibleColumns}
                            activeOptions={[]}
                            onAddNew={
                                currUser?.role == "technical"
                                    ? undefined
                                    : () => {
                                        reset({});
                                        onOpen();
                                    }
                            }
                            onDoubleClick={(item) => {
                                router.push(`/dashboard/licenses/${item.id}`);
                            }}
                        />
                    </Tab>
                    <Tab key="active" title="Aktif" className="w-full">
                        <DataTable
                            storageKey="activeLicenses"
                            isCompact
                            isStriped
                            emptyContent="Herhangi bir lisans bulunamadı!"
                            defaultRowsPerPage={20}
                            data={activeLicenses || []}
                            columns={columns}
                            renderCell={renderCell}
                            searchValue={""}
                            sortOption={{
                                column: "orderedAt",
                                direction: "descending",
                            }}
                            initialVisibleColumNames={visibleColumns}
                            activeOptions={[]}
                            onAddNew={
                                currUser?.role == "technical"
                                    ? undefined
                                    : () => {
                                        reset({});
                                        onOpen();
                                    }
                            }
                            onDoubleClick={(item) => {
                                router.push(`/dashboard/licenses/${item.id}`);
                            }}
                        />
                    </Tab>
                </Tabs>
            </div>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
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
                            onSubmit={handleSubmit(onSubmit)}
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
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                                >
                                    Ürün
                                </label>
                                <Controller
                                    control={control}
                                    name="productId"
                                    render={({
                                        field: { onChange, value },
                                    }) => (<AutoComplete
                                        value={value}
                                        data={products || []}
                                        onChange={async (e) => {
                                            onChange(e);
                                            resetField("applianceId");
                                            const appliances: ListBoxItem[] =
                                                await getAppliances(true, e);
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
                                    control={control}
                                    name="applianceId"
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
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                                >
                                    Cihaz Seri Numarası
                                </label>
                                <input
                                    type="text"
                                    id="appSerialNo"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("appSerialNo", {
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
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2 after:content-['*'] after:ml-0.5 after:text-red-500"
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
                                    {...register("serialNo", {
                                        maxLength: 50,
                                    })}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="startDate"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                                >
                                    Başlangıç Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("startDate")}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="expiryDate"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                                >
                                    Bitiş Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="expiryDate"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("expiryDate")}
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
                                        {...register("boughtTypeId")}
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
                                    htmlFor="boughtAt"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                                >
                                    Alım Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="boughtAt"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("boughtAt")}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="soldAt"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                                >
                                    Satış Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="soldAt"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("soldAt")}
                                />
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
                                    {...register("orderedAt")}
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
                                    htmlFor="cusName"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2 after:content-['*'] after:ml-0.5"
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

                            <div className="relative flex items-center mt-2">
                                <div className="flex-grow border-t border-zinc-200"></div>
                                <span className="flex-shrink mx-4 text-xs text-zinc-500">
                                    veya
                                </span>
                                <div className="flex-grow border-t border-zinc-200"></div>
                            </div>

                            <div>
                                <label
                                    htmlFor="customerId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
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
                                        />
                                    )}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="dealerId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
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
                            </div>
                            <div>
                                <label
                                    htmlFor="supplierId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
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
                                        {...register("note", {
                                            maxLength: 500,
                                        })}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-row gap-2 mt-4">
                                <div className="flex-1"></div>
                                <Button
                                    color="danger"
                                    onPress={onClose}
                                    className="bg-red-600"
                                >
                                    Kapat
                                </Button>
                                <Button
                                    type="submit"
                                    color="success"
                                    className="text-white bg-green-600"
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
