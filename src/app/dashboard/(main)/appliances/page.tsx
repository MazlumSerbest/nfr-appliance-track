"use client";
import React, { useCallback, useEffect, useState } from "react";
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
} from "@heroui/modal";
import { Tabs, Tab } from "@heroui/tabs";
import { SortDescriptor } from "@heroui/table";
import { Button } from "@heroui/button";

import Skeleton, { TableSkeleton } from "@/components/loaders/Skeleton";
import DataTable from "@/components/DataTable";
import AutoComplete from "@/components/AutoComplete";

import useUserStore from "@/store/user";
import { DateFormat, DateTimeFormat } from "@/utils/date";
import {
    getProducts,
    getCustomers,
    getDealers,
    getSuppliers,
} from "@/lib/data";
import { BiInfoCircle } from "react-icons/bi";

interface IFormInput {
    productId: number;
    serialNo: string;
    boughtAt: string;
    soldAt: string;
    note?: string;
    isDemo: boolean;
    customerId: number;
    cusName: string;
    dealerId: number;
    subDealerId: number;
    supplierId: number;
    invoiceCurrentId: number;
    createdBy: string;
}

export default function Appliances() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user: currUser } = useUserStore();

    const [submitting, setSubmitting] = useState(false);
    const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

    const [selectedTab, setSelectedTab] = useState(() => {
        let param = searchParams.get("tab");
        if (param) return param;
        else {
            if (typeof window !== "undefined") {
                let openTabJSON = localStorage?.getItem("appliancesOpenTab");

                if (openTabJSON) {
                    return JSON.parse(openTabJSON);
                } else {
                    return "stock";
                }
            }
        }
    });

    const [stockAppliances, setStockAppliances] = useState<vAppliance[] | null>(
        null,
    );
    const [orderAppliances, setOrderAppliances] = useState<vAppliance[] | null>(
        null,
    );
    const [activeAppliances, setActiveAppliances] = useState<
        vAppliance[] | null
    >(null);
    const [demoAppliances, setDemoAppliances] = useState<vAppliance[] | null>(
        null,
    );

    const [products, setProducts] = useState<ListBoxItem[] | null>(null);
    const [customers, setCustomers] = useState<ListBoxItem[] | null>(null);
    const [dealers, setDealers] = useState<ListBoxItem[] | null>(null);
    const [suppliers, setSuppliers] = useState<ListBoxItem[] | null>(null);

    const { data, error, mutate, isLoading } = useSWR("/api/appliance", null, {
        revalidateOnFocus: false,
        onSuccess: (data) => {
            setStockAppliances(
                data.filter(
                    (a: vAppliance) => a.status == "stock" && !a.isDemo,
                ),
            );
            setOrderAppliances(
                data.filter(
                    (a: vAppliance) => a.status == "order" && !a.isDemo,
                ),
            );
            setActiveAppliances(
                data.filter(
                    (a: vAppliance) => a.status == "active" && !a.isDemo,
                ),
            );
            setDemoAppliances(data.filter((a: vAppliance) => a.isDemo));
        },
    });

    //#region Form
    const { register, reset, handleSubmit, control } = useForm<IFormInput>({});

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setSubmitting(true);
        data.createdBy = currUser?.username ?? "";

        await fetch("/api/appliance", {
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

            setSubmitting(false);
            return result;
        });
    };
    //#endregion

    //#region Table
    const visibleColumns = [
        "serialNo",
        "product",
        "customerName",
        "dealerName",
        "subDealerName",
        "supplierName",
        "boughtAt",
        "soldAt",
    ];

    const sort: SortDescriptor = {
        column: "createdAt",
        direction: "descending",
    };

    const columns: Column[] = [
        {
            key: "serialNo",
            name: "Seri Numarası",
            width: 200,
            searchable: true,
            sortable: true,
        },
        {
            key: "product",
            name: "Ürün (Model)",
            width: 150,
            searchable: true,
            sortable: true,
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

    const renderCell = useCallback(
        (appliance: vAppliance, columnKey: React.Key) => {
            const cellValue: any =
                appliance[columnKey as keyof typeof appliance];

            switch (columnKey) {
                case "customerName":
                case "dealerName":
                case "subDealerName":
                case "supplierName":
                    return (
                        <p>
                            {cellValue
                                ? cellValue.length > 25
                                    ? cellValue.substring(0, 25) + "..."
                                    : cellValue
                                : "-"}
                        </p>
                    );
                case "boughtAt":
                case "soldAt":
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
                    aria-label="Appliance Tab"
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
                            "appliancesOpenTab",
                            JSON.stringify(key),
                        );
                    }}
                >
                    <Tab key="stock" title="Stok" className="w-full">
                        <DataTable
                            storageKey="stockAppliances"
                            compact
                            striped
                            isLoading={isLoading}
                            emptyContent="Herhangi bir cihaz bulunamadı!"
                            defaultRowsPerPage={20}
                            data={stockAppliances || []}
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
                                router.push(`/dashboard/appliances/${item.id}`);
                            }}
                        />
                    </Tab>

                    <Tab key="order" title="Sipariş" className="w-full">
                        <DataTable
                            storageKey="orderAppliances"
                            compact
                            striped
                            isLoading={isLoading}
                            emptyContent="Herhangi bir cihaz bulunamadı!"
                            defaultRowsPerPage={20}
                            data={orderAppliances || []}
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
                                router.push(`/dashboard/appliances/${item.id}`);
                            }}
                        />
                    </Tab>

                    <Tab key="active" title="Aktif" className="w-full">
                        <DataTable
                            storageKey="activeAppliances"
                            compact
                            striped
                            isLoading={isLoading}
                            emptyContent="Herhangi bir cihaz bulunamadı!"
                            defaultRowsPerPage={20}
                            data={activeAppliances || []}
                            columns={columns}
                            renderCell={renderCell}
                            sortOption={{
                                column: "soldAt",
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
                                router.push(`/dashboard/appliances/${item.id}`);
                            }}
                        />
                    </Tab>

                    <Tab key="demo" title="Demo" className="w-full">
                        <DataTable
                            storageKey="demoAppliances"
                            compact
                            striped
                            isLoading={isLoading}
                            emptyContent="Herhangi bir cihaz bulunamadı!"
                            defaultRowsPerPage={20}
                            data={demoAppliances || []}
                            columns={columns}
                            renderCell={renderCell}
                            sortOption={sort}
                            initialVisibleColumNames={visibleColumns}
                            activeOptions={[]}
                            onAddNew={
                                currUser?.role == "technical"
                                    ? undefined
                                    : () => {
                                          reset({ isDemo: true });
                                          onOpen();
                                      }
                            }
                            onDoubleClick={(item) => {
                                router.push(`/dashboard/appliances/${item.id}`);
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
                        Yeni Cihaz
                    </ModalHeader>
                    <ModalBody>
                        <form
                            action=""
                            autoComplete="off"
                            className="flex flex-col gap-2"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className="relative flex items-center">
                                <div className="flex-grow border-t border-zinc-200"></div>
                                <span className="flex-shrink mx-4 text-base text-zinc-500">
                                    Ürün Bilgileri
                                </span>
                                <div className="flex-grow border-t border-zinc-200"></div>
                            </div>

                            <div>
                                <label
                                    htmlFor="serialNo"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2 after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Seri Numarası
                                </label>
                                <input
                                    type="text"
                                    id="serialNo"
                                    required
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("serialNo", {
                                        required: true,
                                        maxLength: 50,
                                    })}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="productId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2 after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Ürün (Model)
                                </label>
                                <Controller
                                    control={control}
                                    name="productId"
                                    rules={{ required: true }}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <AutoComplete
                                            onChange={onChange}
                                            value={value}
                                            data={products || []}
                                        />
                                    )}
                                />
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

                            <div>
                                <label
                                    htmlFor="invoiceCurrentId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
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
                                <Button variant="bordered" onPress={onClose}>
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
