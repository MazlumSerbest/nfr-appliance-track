"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import toast from "react-hot-toast";

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
} from "@nextui-org/modal";
import { SortDescriptor } from "@nextui-org/table";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";

import DataTable from "@/components/DataTable";
import BoolChip from "@/components/BoolChip";
import Skeleton, { TableSkeleton } from "@/components/loaders/Skeleton";
import { BiLinkExternal, BiTrash } from "react-icons/bi";
import useUserStore from "@/store/user";
import { DateTimeFormat } from "@/utils/date";

interface IFormInput {
    ip: string;
    login: string;
    password: string;
    note: string;
    createdBy: string;
}

export default function Connections() {
    const router = useRouter();
    const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
    const { user: currUser } = useUserStore();

    const { register, reset, handleSubmit } = useForm<IFormInput>({
        defaultValues: {
            note: "",
        },
    });
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        data.createdBy = currUser?.username ?? "";
        await fetch("/api/connection", {
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

    const visibleColumns = ["ip", "login", "note", "actions"];

    const sort: SortDescriptor = {
        column: "createdAt",
        direction: "descending",
    };

    // const activeOptions = [
    //     { name: "Yes", key: "true" },
    //     { name: "No", key: "false" },
    // ];

    const columns: Column[] = [
        {
            key: "ip",
            name: "IP",
            width: 150,
            searchable: true,
        },
        {
            key: "login",
            name: "Kullanıcı",
            width: 150,
            searchable: true,
        },
        {
            key: "note",
            name: "Not",
            width: 200,
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
        (connection: Connection, columnKey: React.Key) => {
            const cellValue: any =
                connection[columnKey as keyof typeof connection];

            switch (columnKey) {
                case "ip":
                    return (
                        <a
                            href={"http://" + cellValue}
                            target="_blank"
                            className="underline text-sky-400"
                        >
                            {cellValue}
                        </a>
                    );
                case "active":
                    return <BoolChip value={cellValue} />;
                case "note":
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
                case "actions":
                    return (
                        <div className="flex justify-start items-center gap-2">
                            <Tooltip key={connection.id + "-det"} content="Detay">
                                <span className="text-xl text-green-600 active:opacity-50">
                                    <BiLinkExternal
                                        onClick={() =>
                                            router.push(
                                                "connections/" + connection.id,
                                            )
                                        }
                                    />
                                </span>
                            </Tooltip>
                            {/* <Tooltip key={connection.id} content="Sil">
                                <span className="text-xl text-red-500 active:opacity-50">
                                    <BiTrash onClick={() => {}} />
                                </span>
                            </Tooltip> */}
                        </div>
                    );
                default:
                    return cellValue;
            }
        },
        [router],
    );

    const { data, error, mutate } = useSWR("/api/connection");

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
                emptyContent="Herhangi bir bağlantı bulunamadı!"
                data={data || []}
                columns={columns}
                renderCell={renderCell}
                sortOption={sort}
                initialVisibleColumNames={visibleColumns}
                // activeOptions={[]}
                onAddNew={() => onOpen()}
                onDoubleClick={(item) =>
                    router.push("/dashboard/connections/" + item.id)
                }
            />
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
                backdrop="opaque"
                shadow="lg"
                isDismissable={false}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-zinc-600">
                        Yeni Bağlantı
                    </ModalHeader>
                    <ModalBody>
                        <form
                            action=""
                            autoComplete="off"
                            className="flex flex-col gap-3"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div>
                                <label
                                    htmlFor="ip"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    IP <span className="text-red-400">*</span>
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:max-w-md">
                                        <span className="flex select-none items-center pl-3 text-zinc-400 sm:text-sm">
                                            http://
                                        </span>
                                        <input
                                            type="text"
                                            // name="ip"
                                            id="ip"
                                            autoComplete="ip"
                                            required
                                            // placeholder="1.1.1.1"
                                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-zinc-700 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
                                            {...register("ip", {
                                                required: true,
                                                maxLength: 40,
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="login"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Kullanıcı{" "}
                                    <span className="text-red-400">*</span>
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        id="login"
                                        required
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                        {...register("login", {
                                            required: true,
                                            maxLength: 30,
                                        })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Şifre{" "}
                                    <span className="text-red-400">*</span>
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="password"
                                        id="password"
                                        autoComplete="off"
                                        required
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                        {...register("password", {
                                            required: true,
                                            maxLength: 30,
                                        })}
                                    />
                                </div>
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
                                            maxLength: 400,
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
