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
import { Button } from "@nextui-org/button";

import Skeleton, { TableSkeleton } from "@/components/loaders/Skeleton";
import DataTable from "@/components/DataTable";
import BoolChip from "@/components/BoolChip";
import RegInfo from "@/components/buttons/RegInfo";
import DeleteButton from "@/components/buttons/DeleteButton";
import { DateTimeFormat } from "@/utils/date";
import { activeOptions } from "@/lib/constants";
import { BiInfoCircle, BiTrash } from "react-icons/bi";
import useUserStore from "@/store/user";

interface IFormInput {
    id: number;
    active: boolean;
    type: string;
    createdBy: string;
    updatedBy?: string;
}

export default function BoughtTypes() {
    const [isNew, setIsNew] = useState(false);
    const { user: currUser } = useUserStore();
    const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

    const { data, error, mutate } = useSWR("/api/boughtType");

    //#region Form
    const { register, reset, handleSubmit, control } = useForm<IFormInput>({
        defaultValues: { active: true },
    });
    const onSubmitNew: SubmitHandler<IFormInput> = async (data) => {
        data.createdBy = currUser?.username ?? "";

        await fetch("/api/boughtType", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        }).then(async (res) => {
            const result = await res.json();
            if (res.ok) {
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

        await fetch(`/api/boughtType/${data.id}`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        }).then(async (res) => {
            const result = await res.json();
            if (res.ok) {
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
    const visibleColumns = ["type", "active", "actions"];

    const sort: SortDescriptor = {
        column: "createdAt",
        direction: "descending",
    };

    const columns: Column[] = [
        {
            key: "type",
            name: "Tip",
            width: 200,
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
        (boughtType: BoughtType, columnKey: React.Key) => {
            const cellValue: any =
                boughtType[columnKey as keyof typeof boughtType];

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
                                data={boughtType}
                                trigger={
                                    <span>
                                        <BiInfoCircle />
                                    </span>
                                }
                            />
                            {/* <ActiveButton
                                table="boughtTypes"
                                data={boughtType}
                                mutate={mutate}
                            />
                            <Tooltip
                                key={boughtType.id + "-edit"}
                                content="Düzenle"
                            >
                                <span className="text-xl text-green-600 active:opacity-50 cursor-pointer">
                                    <BiEdit
                                        onClick={() => {
                                            setIsNew(false);
                                            reset(boughtType);
                                            onOpen();
                                        }}
                                    />
                                </span>
                            </Tooltip> */}
                            <DeleteButton
                                table="boughtTypes"
                                data={boughtType}
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
                isCompact
                isStriped
                className="mt-4 mb-2"
                emptyContent="Herhangi bir alım tipi bulunamadı!"
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
                onDoubleClick={(boughtType) => {
                    setIsNew(false);
                    reset(boughtType);
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
                        {isNew ? "Yeni Alım Tipi" : "Alım Tipi Güncelle"}
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
                                        <div className="flex flex-row">
                                            <label
                                                htmlFor="active"
                                                className="text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
                                            >
                                                Aktif
                                            </label>
                                            <div className="flex h-6 ml-3 items-center">
                                                <input
                                                    id="active"
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-zinc-300 ring-offset-1 focus:ring-2 focus:ring-sky-500 outline-none cursor-pointer accent-sky-600"
                                                    {...register("active")}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

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
                                        maxLength: 80,
                                    })}
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
