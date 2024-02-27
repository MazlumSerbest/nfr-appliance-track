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
import { Tab, Tabs } from "@nextui-org/tabs";
import { SortDescriptor } from "@nextui-org/table";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";

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
import { DateTimeFormat, DateFormat } from "@/utils/date";
import useUserStore from "@/store/user";
import {
    getCustomers,
    getDealers,
    getProducts,
    getLicenseTypes,
} from "@/lib/data";

interface IFormInput {
    date: string;
    customerId: number;
    dealerId?: number;
    productId?: number;
    licenseTypeId?: number;
    note?: string;
    createdBy: string;
}

export default function Licenses() {
    const router = useRouter();
    const { user: currUser } = useUserStore();
    const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

    const [customers, setCustomers] = useState<ListBoxItem[] | null>(null);
    const [dealers, setDealers] = useState<ListBoxItem[] | null>(null);
    const [products, setProducts] = useState<ListBoxItem[] | null>(null);
    const [licenseTypes, setLicenseTypes] = useState<ListBoxItem[] | null>(
        null,
    );

    //#region Form
    const { register, reset, handleSubmit, control } = useForm<IFormInput>();
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        data.createdBy = currUser?.username ?? "";

        await fetch("/api/project", {
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
        "customerName",
        "dealerName",
        "productModel",
        "productBrand",
        "date",
        "licenseType",
    ];

    const sort: SortDescriptor = {
        column: "createdAt",
        direction: "descending",
    };

    const columns: Column[] = [
        {
            key: "customerName",
            name: "Müşteri",
            width: 150,
            searchable: true,
            sortable: true,
        },
        {
            key: "dealerName",
            name: "Bayi",
            width: 150,
            searchable: true,
            sortable: true,
        },
        {
            key: "date",
            name: "Proje Tarihi",
            width: 150,
        },
        {
            key: "productModel",
            name: "Ürün",
            width: 150,
            searchable: true,
            sortable: true,
        },
        {
            key: "productBrand",
            name: "Marka",
            width: 150,
            searchable: true,
            sortable: true,
        },
        {
            key: "licenseType",
            name: "Lisans Tipi",
            width: 150,
            searchable: true,
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
        },
    ];

    const renderCell = React.useCallback(
        (project: vProject, columnKey: React.Key) => {
            const cellValue: any = project[columnKey as keyof typeof project];

            switch (columnKey) {
                case "customerName":
                case "dealerName":
                    return (
                        <p>
                            {cellValue
                                ? cellValue.length > 40
                                    ? cellValue.substring(0, 40) + "..."
                                    : cellValue
                                : "-"}
                        </p>
                    );
                case "date":
                    return <p>{DateFormat(cellValue)}</p>;
                case "licenseType":
                    return project.licenseType
                        ? project.licenseType + " " + project.licenseDuration
                        : "-";
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

    const { data, error, mutate } = useSWR("/api/project");

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
            <DataTable
                isCompact
                isStriped
                className="mt-4 mb-2"
                emptyContent="Herhangi bir proje bulunamadı!"
                data={data || []}
                columns={columns}
                renderCell={renderCell}
                sortOption={sort}
                initialVisibleColumNames={visibleColumns}
                // activeOptions={[]}
                onAddNew={
                    currUser?.role == "technical"
                        ? undefined
                        : () => {
                              reset({});
                              onOpen();
                          }
                }
                onDoubleClick={(item) =>
                    router.push("/dashboard/projects/" + item.id)
                }
            />

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
                backdrop="opaque"
                shadow="lg"
                isDismissable={false}
                scrollBehavior="outside"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-zinc-500">
                        Yeni Proje
                    </ModalHeader>
                    <ModalBody>
                        <form
                            autoComplete="off"
                            className="flex flex-col gap-2"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div>
                                <label
                                    htmlFor="date"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500 mb-2"
                                >
                                    Proje Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    required
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("date", { required: true })}
                                />
                            </div>

                            <Divider className="my-3" />

                            <div>
                                <label
                                    htmlFor="customerId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500 mb-2"
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
                                    htmlFor="licenseTypeId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
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
                                        />
                                    )}
                                />
                            </div>

                            <Divider className="my-3" />

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
