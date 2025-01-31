"use client";
import React, { useState } from "react";
import useSWR from "swr";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import toast from "react-hot-toast";

import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    useDisclosure,
} from "@heroui/modal";
import { SortDescriptor } from "@heroui/table";
import { Switch } from "@heroui/switch";
import { Button } from "@heroui/button";

import Skeleton, { TableSkeleton } from "@/components/loaders/Skeleton";
import BoolChip from "@/components/BoolChip";
import DataTable from "@/components/DataTable";
import RegInfo from "@/components/buttons/RegInfo";
import DeleteButton from "@/components/buttons/DeleteButton";
import { activeOptions } from "@/lib/constants";
import { DateTimeFormat } from "@/utils/date";
import { BiTrash, BiInfoCircle } from "react-icons/bi";
import useUserStore from "@/store/user";

type IFormInput = {
    id: number;
    active: boolean;
    name: string;
    createdBy: string;
    updatedBy: string;
};

export default function BrandsPage() {
    const [isNew, setIsNew] = useState(false);
    const { user: currUser } = useUserStore();
    const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

    const { data, error, mutate } = useSWR("/api/brand");

    //#region Form
    const { register, reset, handleSubmit, control } = useForm<IFormInput>({
        defaultValues: { active: true },
    });
    const onSubmitNew: SubmitHandler<IFormInput> = async (data) => {
        data.createdBy = currUser?.username ?? "";

        await fetch("/api/brand", {
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
    const onSubmitUpdate: SubmitHandler<IFormInput> = async (data) => {
        data.updatedBy = currUser?.username ?? "";

        await fetch(`/api/brand/${data.id}`, {
            method: "PUT",
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
    const visibleColumns = ["name", "active", "actions"];

    const sort: SortDescriptor = {
        column: "createdAt",
        direction: "descending",
    };

    const columns: Column[] = [
        {
            key: "name",
            name: "Ad",
            width: 150,
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
            key: "actions",
            name: "Aksiyonlar",
            width: 100,
        },
    ];

    const renderCell = React.useCallback(
        (brand: Brand, columnKey: React.Key) => {
            const cellValue: any = brand[columnKey as keyof typeof brand];

            switch (columnKey) {
                case "active":
                    return <BoolChip value={cellValue} />;
                case "createdAt":
                    return <p>{DateTimeFormat(cellValue)}</p>;
                case "updatedAt":
                    return <p>{DateTimeFormat(cellValue)}</p>;
                case "actions":
                    return (
                        <div className="relative flex justify-start items-center gap-2">
                            <RegInfo
                                data={brand}
                                trigger={
                                    <span>
                                        <BiInfoCircle />
                                    </span>
                                }
                            />
                            <DeleteButton
                                table="brands"
                                data={brand}
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
        [mutate],
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
                storageKey="brands"
                compact
                striped
                className="mt-4 mb-2"
                emptyContent="Herhangi bir marka bulunamadı!"
                data={data || []}
                columns={columns}
                renderCell={renderCell}
                sortOption={sort}
                initialVisibleColumNames={visibleColumns}
                activeOptions={activeOptions}
                onAddNew={
                    currUser?.role == "technical"
                        ? undefined
                        : () => {
                              setIsNew(true);
                              reset({});
                              reset({});
                              onOpen();
                          }
                }
                onDoubleClick={
                    currUser?.role == "technical"
                        ? undefined
                        : (brand) => {
                              setIsNew(false);
                              reset(brand);
                              onOpen();
                          }
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
                        {isNew ? "Yeni Marka" : "Marka Güncelle"}
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
                            {!isNew ? (
                                <div>
                                    <div className="relative flex flex-col gap-x-3 mb-3">
                                        <div className="flex flex-row items-center gap-4">
                                            <label
                                                htmlFor="active"
                                                className="text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
                                            >
                                                Aktif
                                            </label>
                                            <Controller
                                                control={control}
                                                name="active"
                                                render={({
                                                    field: { onChange, value },
                                                }) => (
                                                    <Switch
                                                        size="sm"
                                                        color="primary"
                                                        onChange={onChange}
                                                        isSelected={value}
                                                        classNames={{
                                                            wrapper:
                                                                "group-data-[selected=true]:bg-sky-500",
                                                        }}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Ad
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                        {...register("name", {
                                            required: true,
                                            maxLength: 80,
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
