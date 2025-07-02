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
import { getUsers, getProducts, getAppliances, getLicenses } from "@/lib/data";
import { BiInfoCircle } from "react-icons/bi";

interface IFormInput {
    status: "waiting" | "complete";
    type: "appliance" | "license";
    userId: number;
    licenseId?: number;
    applianceId?: number;
    note?: string;
    createdBy: string;
}

export default function Setups() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user: currUser } = useUserStore();

    const [submitting, setSubmitting] = useState(false);
    const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
    const [orderType, setOrderType] = useState("appliance");

    const [selectedTab, setSelectedTab] = useState(() => {
        let param = searchParams.get("tab");
        if (param) return param;
        else {
            if (typeof window !== "undefined") {
                let openTabJSON = localStorage?.getItem("setupsOpenTab");

                if (openTabJSON) {
                    return JSON.parse(openTabJSON);
                } else {
                    return "waiting";
                }
            }
        }
    });

    const [waiting, setWaiting] = useState<Setup[]>([]);
    const [complete, setComplete] = useState<Setup[]>([]);

    const [users, setUsers] = useState<ListBoxItem[] | null>(null);
    const [products, setProducts] = useState<ListBoxItem[] | null>(null);
    const [licenses, setLicenses] = useState<ListBoxItem[] | null>(null);
    const [appliances, setAppliances] = useState<ListBoxItem[] | null>(null);

    const { data, error, mutate } = useSWR("/api/setup", null, {
        revalidateOnFocus: false,
        onSuccess: (data) => {
            setWaiting(data.filter((a: Setup) => a.status === "waiting"));
            setComplete(data.filter((a: Setup) => a.status === "complete"));
        },
    });

    //#region Form
    const { register, reset, handleSubmit, control, setValue } =
        useForm<IFormInput>({});

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setSubmitting(true);
        data.createdBy = currUser?.username ?? "";
        data.status = "waiting";

        await fetch("/api/setup", {
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
                router.push(`/dashboard/setups/${result.id}`);
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
        "type",
        "applianceSerialNo",
        "product",
        "licenseSerialNo",
        "licenseType",
        "customerName",
        "dealerName",
        "subDealerName",
        "supplierName",
        "soldAt",
    ];

    const sort: SortDescriptor = {
        column: "createdAt",
        direction: "descending",
    };

    const columns: Column[] = [
        {
            key: "type",
            name: "Kurulum Tipi",
            width: 100,
            searchable: true,
        },
        {
            key: "assignedUser",
            name: "Atanan Kullanıcı ",
            width: 100,
            searchable: true,
            sortable: true,
        },
        {
            key: "applianceSerialNo",
            name: "Cihaz Seri No",
            width: 100,
            searchable: true,
        },
        {
            key: "product",
            name: "Ürün (Model)",
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
            key: "soldAt",
            name: "Satış Tarihi",
            width: 80,
            sortable: true,
        },
        {
            key: "customerName",
            name: "Müşteri",
            searchable: true,
            sortable: true,
        },
        {
            key: "dealerName",
            name: "Bayi",
            searchable: true,
            sortable: true,
        },
        {
            key: "subDealerName",
            name: "Alt Bayi",
            searchable: true,
            sortable: true,
        },
        {
            key: "supplierName",
            name: "Tedarikçi",
            searchable: true,
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

    const renderCell = useCallback((order: vOrder, columnKey: React.Key) => {
        const cellValue: any = order[columnKey as keyof typeof order];

        switch (columnKey) {
            case "type":
                return (
                    <p>
                        {cellValue === "appliance"
                            ? "Cihaz"
                            : cellValue === "license"
                            ? "Lisans"
                            : "-"}
                    </p>
                );
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
        const users: ListBoxItem[] = await getUsers(true, currUser);
        setUsers(users);
        const pro: ListBoxItem[] = await getProducts(true);
        setProducts(pro);
        const lic: ListBoxItem[] = await getLicenses(true, undefined, [
            "stock",
            "order",
            "waiting",
        ]);
        setLicenses(lic);
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
                    aria-label="Setup Tab"
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
                            "setupsOpenTab",
                            JSON.stringify(key),
                        );
                    }}
                >
                    <Tab key="waiting" title="Bekleyen" className="w-full">
                        <DataTable
                            storageKey="waiting"
                            compact
                            striped
                            emptyContent="Herhangi bir kurulum bulunamadı!"
                            defaultRowsPerPage={20}
                            data={waiting || []}
                            columns={columns}
                            renderCell={renderCell}
                            sortOption={sort}
                            initialVisibleColumNames={visibleColumns}
                            activeOptions={[]}
                            onAddNew={
                                currUser?.role == "technical" ||
                                currUser?.role == "admin"
                                    ? () => {
                                          reset({});
                                          onOpen();
                                      }
                                    : undefined
                            }
                            onDoubleClick={(item) => {
                                router.push(`/dashboard/setups/${item.id}`);
                            }}
                        />
                    </Tab>

                    <Tab key="complete" title="Tamamlanmış" className="w-full">
                        <DataTable
                            storageKey="complete"
                            compact
                            striped
                            emptyContent="Herhangi bir kurulum bulunamadı!"
                            defaultRowsPerPage={20}
                            data={complete || []}
                            columns={columns}
                            renderCell={renderCell}
                            sortOption={sort}
                            initialVisibleColumNames={visibleColumns}
                            activeOptions={[]}
                            onDoubleClick={(item) => {
                                router.push(`/dashboard/setups/${item.id}`);
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
                        Yeni Kurulum
                    </ModalHeader>
                    <ModalBody>
                        <form
                            action=""
                            autoComplete="off"
                            className="flex flex-col gap-2"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div>
                                <label
                                    htmlFor="type"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                                >
                                    Kurulum Tipi
                                </label>
                                <div className="block w-full h-10 rounded-md border-0 px-3 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:text-sm sm:leading-6 outline-none">
                                    <select
                                        id="type"
                                        className="w-full border-none text-sm text-zinc-700 outline-none"
                                        {...register("type")}
                                        onChange={(e) => {
                                            setOrderType(e.target.value);
                                            setValue(
                                                "type",
                                                e.target.value as
                                                    | "appliance"
                                                    | "license",
                                            );
                                            setValue("applianceId", undefined);
                                            setValue("licenseId", undefined);
                                            setAppliances([]);
                                        }}
                                    >
                                        <option value="appliance">Cihaz</option>
                                        <option value="license">Lisans</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="userId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Kullanıcı
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
                                        />
                                    )}
                                />
                            </div>

                            {orderType === "appliance" ? (
                                <>
                                    <div>
                                        <label
                                            htmlFor="product"
                                            className="block text-sm font-semibold leading-6 text-zinc-500"
                                        >
                                            Ürün (Model)
                                        </label>
                                        <span className="flex flex-row font-normal text-xs text-zinc-400 items-center gap-1 mb-1">
                                            <BiInfoCircle className="text-lg" />
                                            Cihazların filtrelenmesi için ürün
                                            (model) seçimi yapmalısınız. Ürün
                                            seçimi yapmadan cihaz seri
                                            numaraları listelenmez!
                                        </span>
                                        <AutoComplete
                                            data={products || []}
                                            onChange={async (e) => {
                                                const appliances: ListBoxItem[] =
                                                    await getAppliances(
                                                        true,
                                                        e,
                                                    );
                                                setAppliances(appliances);
                                            }}
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
                                            Cihaz seçmek için ürün seçimi
                                            yapmanız gereklidir!
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
                                </>
                            ) : (
                                <div>
                                    <label
                                        htmlFor="licenseId"
                                        className="block text-sm font-semibold leading-6 text-zinc-500"
                                    >
                                        Lisans
                                    </label>
                                    <Controller
                                        control={control}
                                        name="licenseId"
                                        render={({
                                            field: { onChange, value },
                                        }) => (
                                            <AutoComplete
                                                onChange={onChange}
                                                value={value}
                                                data={licenses || []}
                                            />
                                        )}
                                    />
                                </div>
                            )}

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
