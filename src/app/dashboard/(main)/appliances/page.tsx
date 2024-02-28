"use client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import toast from "react-hot-toast";

import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/modal";
import { Tabs, Tab } from "@nextui-org/tabs";
import { SortDescriptor } from "@nextui-org/table";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";

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

interface IFormInput {
    productId: number;
    serialNo: string;
    boughtAt: string;
    soldAt: string;
    note?: string;
    customerId: number;
    dealerId: number;
    subDealerId: number;
    supplierId: number;
    createdBy: string;
}

export default function Appliances() {
    const router = useRouter();
    const { user: currUser } = useUserStore();
    const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

    const [stockAppliances, setStockAppliances] = useState<vAppliance[] | null>(
        null,
    );
    const [orderAppliances, setOrderAppliances] = useState<vAppliance[] | null>(
        null,
    );
    const [activeAppliances, setActiveAppliances] = useState<
        vAppliance[] | null
    >(null);

    const [products, setProducts] = useState<ListBoxItem[] | null>(null);
    const [customers, setCustomers] = useState<ListBoxItem[] | null>(null);
    const [dealers, setDealers] = useState<ListBoxItem[] | null>(null);
    const [suppliers, setSuppliers] = useState<ListBoxItem[] | null>(null);

    //#region Form
    const { register, reset, handleSubmit, control } = useForm<IFormInput>({});
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
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
            name: "Ürün",
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

    const renderCell = React.useCallback(
        (appliance: vAppliance, columnKey: React.Key) => {
            const cellValue: any =
                appliance[columnKey as keyof typeof appliance];

            switch (columnKey) {
                case "product":
                    return (
                        <p>
                            {(appliance.productBrand
                                ? appliance.productBrand + " "
                                : "") +
                                (appliance.productModel
                                    ? appliance.productModel
                                    : "")}
                        </p>
                    );
                case "boughtAt":
                    return <p>{DateFormat(cellValue)}</p>;
                case "soldAt":
                    return <p>{DateFormat(cellValue)}</p>;
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
                case "createdAt":
                    return <p>{DateTimeFormat(cellValue)}</p>;
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

    const { data, error, mutate } = useSWR("/api/appliance", null, {
        onSuccess: (data) => {
            setStockAppliances(
                data.filter((a: vAppliance) => a.status == "stock"),
            );
            setOrderAppliances(
                data.filter((a: vAppliance) => a.status == "order"),
            );
            setActiveAppliances(
                data.filter((a: vAppliance) => a.status == "active"),
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
                    aria-label="Appliance Tab"
                    color="primary"
                    size="md"
                    classNames={{
                        cursor: "w-full bg-sky-500",
                        tab: "px-10",
                    }}
                >
                    <Tab key="stock" title="Stok" className="w-full">
                        <DataTable
                            isCompact
                            isStriped
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
                            isCompact
                            isStriped
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
                            isCompact
                            isStriped
                            emptyContent="Herhangi bir cihaz bulunamadı!"
                            defaultRowsPerPage={20}
                            data={activeAppliances || []}
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
                                    className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Seri Numarası
                                </label>
                                <input
                                    type="text"
                                    id="serialNo"
                                    required
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
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
                                    Ürün
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
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Alım Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="boughtAt"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...register("boughtAt")}
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
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
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
