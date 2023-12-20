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
import { SortDescriptor } from "@nextui-org/table";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";

import Skeleton, { TableSkeleton } from "@/components/loaders/Skeleton";
import DataTable from "@/components/DataTable";
import BoolChip from "@/components/BoolChip";
import { BiCheckCircle, BiErrorCircle, BiHelpCircle, BiInfoCircle } from "react-icons/bi";
import { DateFormat, DateTimeFormat } from "@/utils/date";
import useUserStore from "@/store/user";
import IconChip from "@/components/IconChip";
import AutoComplete from "@/components/AutoComplete";
import {
    getProducts,
    getLicenseTypes,
    getCustomers,
    getDealers,
    getSuppliers,
} from "@/lib/data";
import { boughtTypes } from "@/lib/constants";

interface IFormInput {
    id: number;
    isStock: boolean;
    serialNo: string;
    startDate: string;
    expiryDate: string;
    boughtType: string;
    boughtAt: string;
    soldAt: string;
    licenseTypeId: number;
    customerId: number;
    dealerId: number;
    supplierId: number;
    createdBy: string;
    updatedBy: string;
}

export default function Licenses() {
    const router = useRouter();
    const { user: currUser } = useUserStore();
    const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
    const [products, setProducts] = useState<ListBoxItem[] | null>(null);
    const [licenseTypes, setLicenseTypes] = useState<ListBoxItem[] | null>(
        null,
    );
    const [customers, setCustomers] = useState<ListBoxItem[] | null>(null);
    const [dealers, setDealers] = useState<ListBoxItem[] | null>(null);
    const [suppliers, setSuppliers] = useState<ListBoxItem[] | null>(null);

    const { register, reset, resetField, handleSubmit, control } =
        useForm<IFormInput>({ defaultValues: { isStock: false } });
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        data.createdBy = currUser?.username ?? "";
        console.log(data);

        await fetch("/api/license", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        })
            .then(async (res) => {
                const result = await res.json();
                if (res.ok) {
                    toast.success(result.message);
                } else {
                    toast.error(result.message);
                }
                return result;
            })
            .then(() => {
                onClose();
                reset();
                mutate();
            });
    };

    const visibleColumns = [
        "serialNo",
        "product",
        "licenseType",
        "customerName",
        // "dealerName",
        "supplierName",
        "isStock",
        "boughtType",
        // "boughtAt",
        // "soldAt",
        "expiryStatus",
        // "actions",
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
            name: "Alım Türü",
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
            key: "supplierName",
            name: "Tedarikçi",
            width: 120,
            searchable: true,
            sortable: true,
        },
        {
            key: "isStock",
            name: "Stok",
            width: 80,
        },
        {
            key: "boughtAt",
            name: "Alım Tarihi",
            width: 150,
        },
        {
            key: "soldAt",
            name: "Satış Tarihi",
            width: 150,
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
        // {
        //     key: "actions",
        //     name: "Aksiyonlar",
        //     width: 100,
        // },
    ];

    const renderCell = React.useCallback(
        (license: License, columnKey: React.Key) => {
            const cellValue: any = license[columnKey as keyof typeof license];

            switch (columnKey) {
                // case "customerName":
                //     return (
                //         <p>
                //             {cellValue.length > 20
                //                 ? cellValue.substring(0, 20) + "..."
                //                 : cellValue}
                //         </p>
                //     );
                case "product":
                    return license.productModel;
                case "licenseType":
                    return license.licenseType + " " + license.licenseDuration;
                case "isStock":
                    return <BoolChip value={cellValue} />;
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
                case "boughtType":
                    return (
                        <p>
                            {cellValue
                                ? cellValue == "first"
                                    ? "İlk Alım"
                                    : "İkinci Alım"
                                : "-"}
                        </p>
                    );
                case "startDate":
                    return <p>{DateFormat(cellValue)}</p>;
                case "expiryDate":
                    return <p>{DateFormat(cellValue)}</p>;
                case "boughtAt":
                    return <p>{DateFormat(cellValue)}</p>;
                case "soldAt":
                    return <p>{DateFormat(cellValue)}</p>;
                case "createdAt":
                    return <p>{DateTimeFormat(cellValue)}</p>;
                case "updatedAt":
                    return <p>{DateTimeFormat(cellValue)}</p>;
                // case "actions":
                //     return (
                //         <div className="relative flex justify-start items-center gap-2">
                //             <Tooltip key={license.id} content="Detay">
                //                 <span className="text-xl text-green-600 active:opacity-50">
                //                     <BiLinkExternal
                //                         onClick={() =>
                //                             router.push(
                //                                 "appliances/" + license.id,
                //                             )
                //                         }
                //                     />
                //                 </span>
                //             </Tooltip>
                //         </div>
                //     );
                default:
                    return cellValue ? cellValue : "-";
            }
        },
        [],
    );

    async function getData() {
        const pro: ListBoxItem[] = await getProducts(true);
        // const lit: ListBoxItem[] = await getLicenseTypes(true, 1);
        const cus: ListBoxItem[] = await getCustomers(true);
        const deal: ListBoxItem[] = await getDealers(true);
        const sup: ListBoxItem[] = await getSuppliers(true);

        setProducts(pro);
        // setLicenseTypes(lit);
        setCustomers(cus);
        setDealers(deal);
        setSuppliers(sup);
    }

    useEffect(() => {
        getData();
    }, []);

    const { data, error, mutate } = useSWR("/api/license");

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
                emptyContent="Herhangi bir lisans bulunamadı!"
                defaultRowsPerPage={20}
                data={data || []}
                columns={columns}
                renderCell={renderCell}
                sortOption={sort}
                initialVisibleColumNames={visibleColumns}
                activeOptions={[]}
                onAddNew={() => {
                    reset({});
                    onOpen();
                }}
                onDoubleClick={(item) => {
                    router.push(`/dashboard/licenses/${item.id}`);
                }}
            />
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
                    <ModalHeader className="flex flex-col gap-1 text-zinc-600">
                        Yeni Lisans
                    </ModalHeader>
                    <ModalBody>
                        <form
                            action=""
                            autoComplete="off"
                            className="flex flex-col gap-2"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div>
                                <div className="relative flex flex-col gap-x-3">
                                    <div className="flex flex-row">
                                        <label
                                            htmlFor="isStock"
                                            className="text-sm font-semibold leading-6 text-zinc-500"
                                        >
                                            Stok Lisans
                                        </label>
                                        <div className="flex h-6 ml-3 items-center">
                                            <input
                                                id="isStock"
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-zinc-300 ring-offset-1 focus:ring-2 focus:ring-sky-500 outline-none cursor-pointer accent-sky-600"
                                                {...register("isStock", {})}
                                            />
                                        </div>
                                    </div>
                                    <span className="flex flex-row font-normal text-xs text-zinc-400 items-center gap-1 mb-1">
                                        <BiInfoCircle />
                                        Lisans stok kontrolü için gereklidir!
                                    </span>
                                </div>
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
                                    htmlFor="product"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2 after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Ürün
                                </label>
                                <AutoComplete
                                    onChange={async (e) => {
                                        resetField("licenseTypeId");
                                        const licenseTypes: ListBoxItem[] =
                                            await getLicenseTypes(true, e);
                                        setLicenseTypes(licenseTypes);
                                    }}
                                    data={products || []}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="licenseTypeId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Lisans Tipi
                                </label>
                                <span className="flex flex-row font-normal text-xs text-zinc-400 items-center gap-1 mb-1">
                                    <BiInfoCircle />
                                    Lisans tipi seçmek için ürün seçimi yapmanız
                                    gereklidir!
                                </span>
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
                                    htmlFor="startDate"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Başlangıç Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...register("startDate", {})}
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
                                    {...register("expiryDate", {})}
                                />
                            </div>

                            <Divider className="my-3" />

                            <div>
                                <label
                                    htmlFor="boughtType"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Tip
                                </label>
                                <div className="block w-full h-10 rounded-md border-0 px-3 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2">
                                    <select
                                        id="boughtType"
                                        className="w-full border-none text-sm text-zinc-700 outline-none"
                                        {...register("boughtType", {})}
                                    >
                                        <option disabled selected value="">
                                            Satın alım tipi Seçiniz...
                                        </option>
                                        {boughtTypes?.map((t) => (
                                            <option key={t.key} value={t.key}>
                                                {t.name}
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
                                    {...register("boughtAt", {})}
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
                                    {...register("soldAt", {})}
                                />
                            </div>

                            <Divider className="my-3" />

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
