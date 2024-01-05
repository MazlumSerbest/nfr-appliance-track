"use client";
import React, { useState } from "react";
import useSWR from "swr";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/modal";
import { SortDescriptor } from "@nextui-org/table";
import { Tooltip } from "@nextui-org/tooltip";
import { Button } from "@nextui-org/button";

import Skeleton, { TableSkeleton } from "@/components/loaders/Skeleton";
import DataTable from "@/components/DataTable";
import BoolChip from "@/components/BoolChip";
import RegInfo from "@/components/buttons/RegInfo";
import ActiveButton from "@/components/buttons/ActiveButton";
import DeleteButton from "@/components/buttons/DeleteButton";
import { DateTimeFormat } from "@/utils/date";
import { activeOptions } from "@/lib/constants";
import { BiEdit, BiInfoCircle, BiTrash } from "react-icons/bi";
import useUserStore from "@/store/user";

interface IFormInput {
    id: number;
    brand: string;
    type: string;
    duration?: number | null;
    price?: number | null;
    createdBy: string;
    updatedBy?: string;
    product?: Product;
}

export default function LicenseTypes() {
    const [isNew, setIsNew] = useState(false);
    const { user: currUser } = useUserStore();
    const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

    const { data, error, mutate } = useSWR("/api/licenseType");

    //#region Form
    const { register, reset, handleSubmit, control } = useForm<IFormInput>({});
    const onSubmitNew: SubmitHandler<IFormInput> = async (data) => {
        data.createdBy = currUser?.username ?? "";
        data.duration = Number(data.duration);
        data.price = 0;

        await fetch("/api/licenseType", {
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
    const onSubmitUpdate: SubmitHandler<IFormInput> = async (data) => {
        data.updatedBy = currUser?.username ?? "";
        data.duration = Number(data.duration);
        data.price = 0;

        await fetch(`/api/licenseType/${data.id}`, {
            method: "PUT",
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
    //#endregion

    //#region Table
    const visibleColumns = ["brand", "type", "duration", "active", "actions"];

    const sort: SortDescriptor = {
        column: "createdAt",
        direction: "descending",
    };

    const columns: Column[] = [
        {
            key: "brand",
            name: "Marka",
            width: 150,
            searchable: true,
            sortable: true,
        },
        {
            key: "type",
            name: "Tip",
            width: 200,
            searchable: true,
            sortable: true,
        },
        {
            key: "duration",
            name: "Süre",
            width: 80,
            searchable: true,
            sortable: true,
        },
        {
            key: "active",
            name: "Aktif",
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
        {
            key: "actions",
            name: "Aksiyonlar",
            width: 100,
        },
    ];

    const renderCell = React.useCallback(
        (licenseType: LicenseType, columnKey: React.Key) => {
            const cellValue: any =
                licenseType[columnKey as keyof typeof licenseType];

            switch (columnKey) {
                case "active":
                    return <BoolChip value={cellValue} />;
                case "createdAt":
                    return <p>{DateTimeFormat(cellValue)}</p>;
                case "updatedAt":
                    return <p>{DateTimeFormat(cellValue)}</p>;
                case "actions":
                    return (
                        <div className="flex justify-start items-center gap-2">
                            <RegInfo
                                data={licenseType}
                                trigger={
                                    <span>
                                        <BiInfoCircle />
                                    </span>
                                }
                            />
                            <ActiveButton
                                table="licenseTypes"
                                data={licenseType}
                                mutate={mutate}
                            />
                            <Tooltip
                                key={licenseType.id + "-edit"}
                                content="Düzenle"
                            >
                                <span className="text-xl text-green-600 active:opacity-50 cursor-pointer">
                                    <BiEdit
                                        onClick={() => {
                                            setIsNew(false);
                                            reset(licenseType);
                                            onOpen();
                                        }}
                                    />
                                </span>
                            </Tooltip>
                            <DeleteButton
                                table="licenseTypes"
                                data={licenseType}
                                mutate={mutate}
                                trigger={
                                    <span>
                                        <BiTrash />
                                    </span>
                                }
                            />
                        </div>
                    );
                default:
                    return cellValue ? cellValue : "-";
            }
        },
        [onOpen, reset, mutate],
    );
    //#endregion

    if (error) return <div>Yükleme Hatası!</div>;
    if (!data)
        return (
            <div className="flex flex-col mt-4">
                <Skeleton>
                    <TableSkeleton />
                </Skeleton>
            </div>
        );
    return (
        <>
            <DataTable
                isCompact
                isStriped
                className="mt-4 mb-2"
                emptyContent="Herhangi bir lisans tipi bulunamadı!"
                data={data || []}
                columns={columns}
                renderCell={renderCell}
                sortOption={sort}
                initialVisibleColumNames={visibleColumns}
                activeOptions={activeOptions}
                onAddNew={() => {
                    setIsNew(true);
                    reset({});
                    reset({});
                    onOpen();
                }}
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
                        {isNew ? "Yeni Lisans Tipi" : "Lisans Tipi Güncelle"}
                    </ModalHeader>
                    <ModalBody>
                        <form
                            action=""
                            autoComplete="off"
                            className="flex flex-col gap-2"
                            onSubmit={handleSubmit(
                                isNew ? onSubmitNew : onSubmitUpdate,
                            )}
                        >
                            <div>
                                <label
                                    htmlFor="brand"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                                >
                                    Marka
                                </label>
                                <input
                                    type="text"
                                    id="brand"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...register("brand", {
                                        maxLength: 50,
                                    })}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="type"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Tip
                                </label>
                                <input
                                    type="text"
                                    id="type"
                                    required
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...register("type", {
                                        required: true,
                                        maxLength: 50,
                                    })}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="duration"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Süre
                                </label>
                                <input
                                    type="text"
                                    id="duration"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...register("duration", {})}
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
