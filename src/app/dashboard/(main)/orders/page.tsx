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
import { getCustomers, getDealers, getSuppliers } from "@/lib/data";
import { currencyTypes } from "@/lib/constants";

interface IFormInput {
    registerNo: string;
    invoiceNo?: string;
    expiry?: string;
    address?: string;
    note?: string;
    customerId: number;
    dealerId: number;
    subDealerId: number;
    supplierId: number;
    createdBy: string;
}

export default function Orders() {
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
                let openTabJSON = localStorage?.getItem("ordersOpenTab");

                if (openTabJSON) {
                    return JSON.parse(openTabJSON);
                } else {
                    return "order";
                }
            }
        }
    });

    const [order, setOrder] = useState<vAppliance[] | null>(null);
    const [invoice, setInvoice] = useState<vAppliance[] | null>(null);
    const [purchase, setPurchase] = useState<vAppliance[] | null>(null);
    const [complete, setComplete] = useState<vAppliance[] | null>(null);

    const [customers, setCustomers] = useState<ListBoxItem[] | null>(null);
    const [dealers, setDealers] = useState<ListBoxItem[] | null>(null);
    const [suppliers, setSuppliers] = useState<ListBoxItem[] | null>(null);

    const { data, error, mutate } = useSWR("/api/order", null, {
        revalidateOnFocus: false,
        onSuccess: (data) => {
            setOrder(data.filter((a: Order) => a.status === "order"));
            setInvoice(data.filter((a: Order) => a.status === "invoice"));
            setPurchase(data.filter((a: Order) => a.status === "purchase"));
            setComplete(data.filter((a: Order) => a.status === "complete"));
        },
    });

    //#region Form
    const { register, reset, handleSubmit, control } = useForm<IFormInput>({});

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setSubmitting(true);
        data.createdBy = currUser?.username ?? "";

        await fetch("/api/order", {
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
                router.push(`/dashboard/orders/${result.id}`);
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
        "registerNo",
        "invoiceNo",
        "customerName",
        "dealerName",
        "subDealerName",
        "supplierName",
        "soldAt",
        "price",
    ];

    const sort: SortDescriptor = {
        column: "createdAt",
        direction: "descending",
    };

    const columns: Column[] = [
        {
            key: "registerNo",
            name: "Kayıt No",
            width: 100,
            searchable: true,
            sortable: true,
        },
        {
            key: "invoiceNo",
            name: "Fatura",
            width: 100,
            searchable: true,
        },
        {
            key: "applianceSerialNo",
            name: "Cihaz Seri No",
            width: 100,
            searchable: true,
        },
        {
            key: "product",
            name: "Cihaz",
            width: 120,
            searchable: true,
        },
        {
            key: "licenseSerialNo",
            name: "Lisans Seri No",
            width: 100,
            searchable: true,
        },
        {
            key: "licenseType",
            name: "Lisans",
            width: 120,
            searchable: true,
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
            key: "paymentPlan",
            name: "Vade",
            width: 80,
        },
        {
            key: "price",
            name: "Fiyat",
            width: 80,
        },
        {
            key: "soldtAt",
            name: "Satış Tarihi",
            width: 80,
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
        {
            key: "note",
            name: "Not",
            width: 200,
        },
    ];

    const renderCell = useCallback((order: vOrder, columnKey: React.Key) => {
        const cellValue: any = order[columnKey as keyof typeof order];

        switch (columnKey) {
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
            case "product":
                return (
                    <p>
                        {order.productModel || order.productBrand
                            ? order.productBrand + " " + order.productModel
                            : "-"}
                    </p>
                );
            case "price":
                return (
                    <p>
                        {cellValue
                            ? cellValue +
                              (currencyTypes?.find(
                                  (c) => c.key === order.currency,
                              )?.symbol || "₺")
                            : "-"}
                    </p>
                );
            case "soldAt":
                return <p>{DateFormat(cellValue)}</p>;
            case "createdAt":
            case "updatedAt":
                return <p>{DateTimeFormat(cellValue)}</p>;
            default:
                return cellValue ? cellValue : "-";
        }
    }, []);
    //#endregion

    //#region Data
    async function getData() {
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
                    aria-label="Order Tab"
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
                            "ordersOpenTab",
                            JSON.stringify(key),
                        );
                    }}
                >
                    <Tab key="order" title="Sipariş" className="w-full">
                        <DataTable
                            storageKey="order"
                            compact
                            striped
                            emptyContent="Herhangi bir sipariş bulunamadı!"
                            defaultRowsPerPage={20}
                            data={order || []}
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
                                router.push(`/dashboard/orders/${item.id}`);
                            }}
                        />
                    </Tab>

                    <Tab key="invoice" title="Fatura Kesim" className="w-full">
                        <DataTable
                            storageKey="invoice"
                            compact
                            striped
                            emptyContent="Herhangi bir sipariş bulunamadı!"
                            defaultRowsPerPage={20}
                            data={invoice || []}
                            columns={columns}
                            renderCell={renderCell}
                            sortOption={sort}
                            initialVisibleColumNames={visibleColumns}
                            activeOptions={[]}
                            onDoubleClick={(item) => {
                                router.push(`/dashboard/orders/${item.id}`);
                            }}
                        />
                    </Tab>

                    <Tab key="purchase" title="Satın Alım" className="w-full">
                        <DataTable
                            storageKey="purchase"
                            compact
                            striped
                            emptyContent="Herhangi bir sipariş bulunamadı!"
                            defaultRowsPerPage={20}
                            data={purchase || []}
                            columns={columns}
                            renderCell={renderCell}
                            sortOption={sort}
                            initialVisibleColumNames={visibleColumns}
                            activeOptions={[]}
                            onDoubleClick={(item) => {
                                router.push(`/dashboard/orders/${item.id}`);
                            }}
                        />
                    </Tab>

                    <Tab key="complete" title="Tamamlanmış" className="w-full">
                        <DataTable
                            storageKey="complete"
                            compact
                            striped
                            emptyContent="Herhangi bir sipariş bulunamadı!"
                            defaultRowsPerPage={20}
                            data={complete || []}
                            columns={columns}
                            renderCell={renderCell}
                            sortOption={sort}
                            initialVisibleColumNames={visibleColumns}
                            activeOptions={[]}
                            onDoubleClick={(item) => {
                                router.push(`/dashboard/orders/${item.id}`);
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
                        Yeni Sipariş
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
                                    Sipariş Bilgileri
                                </span>
                                <div className="flex-grow border-t border-zinc-200"></div>
                            </div>

                            <div>
                                <label
                                    htmlFor="registerNo"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                                >
                                    Kayıt No
                                </label>
                                <input
                                    type="text"
                                    id="registerNo"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("registerNo", {
                                        maxLength: 50,
                                    })}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="invoiceNo"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                                >
                                    Fatura
                                </label>
                                <input
                                    type="text"
                                    id="invoiceNo"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("invoiceNo", {
                                        maxLength: 50,
                                    })}
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
                                    htmlFor="address"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                                >
                                    Sevk Adresi
                                </label>
                                <div className="mt-2">
                                    <textarea
                                        id="address"
                                        rows={3}
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                        {...register("address", {
                                            maxLength: 500,
                                        })}
                                    />
                                </div>
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
