"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import useUserStore from "@/store/user";
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
import {
    BiCheckCircle,
    BiEdit,
    BiLockAlt,
    BiTrash,
    BiXCircle,
} from "react-icons/bi";
import { DateTimeFormat } from "@/utils/date";
import { activeOptions, userTypes } from "@/lib/constants";

interface IFormInput {
    username: string;
    name?: string;
    email: string;
    role: string;
    password: string;
    confirmPassword: string;
    createdBy: string;
    updatedBy?: string;
}

export default function Users() {
    const router = useRouter();
    const [users, setUsers] = useState();
    const { user: currUser } = useUserStore();
    const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

    const { register, reset, handleSubmit, getValues, formState: { errors } } = useForm<IFormInput>();
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        data.createdBy = currUser?.username ?? "";

        await fetch("/api/user", {
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
                // mutate();
            });
    };

    const visibleColumns = [
        "username",
        "name",
        "email",
        "role",
        "active",
        "actions",
    ];

    const sort: SortDescriptor = {
        column: "id",
        direction: "ascending",
    };

    const columns: Column[] = [
        {
            key: "name",
            name: "Ad",
            searchable: true,
            sortable: true,
            width: 200,
        },
        {
            key: "username",
            name: "Kullanıcı Adı",
            searchable: true,
            sortable: true,
            width: 200,
        },
        {
            key: "email",
            name: "E-Mail",
            searchable: true,
            sortable: true,
            width: 200,
        },
        {
            key: "role",
            name: "Rol",
            width: 100,
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
        (user: User, columnKey: React.Key) => {
            const cellValue: any = user[columnKey as keyof typeof user];

            switch (columnKey) {
                case "name":
                    return cellValue ? cellValue : "-";
                case "active":
                    return <BoolChip value={cellValue} />;
                case "createdAt":
                    return <p>{DateTimeFormat(cellValue)}</p>;
                case "updatedAt":
                    return <p>{DateTimeFormat(cellValue)}</p>;
                case "actions":
                    return (
                        <>
                            {currUser?.role == "admin" ? (
                                <div className="relative flex justify-start items-center gap-2">
                                    {user.username == "admin" ||
                                    user.username == "mehmet.zeytinoglu" ? (
                                        "-"
                                    ) : (
                                        <>
                                            <Tooltip
                                                key={user.id + "-edit"}
                                                content="Düzenle"
                                            >
                                                <span className="text-xl text-green-600 active:opacity-50 cursor-pointer">
                                                    <BiEdit
                                                        onClick={() => {
                                                            // setIsNew(false);
                                                            // reset(user);
                                                            onOpen();
                                                        }}
                                                    />
                                                </span>
                                            </Tooltip>
                                            <Tooltip
                                                key={user.id + "-pass"}
                                                content="Şifre Değiştir"
                                            >
                                                <span className="text-xl text-sky-500 active:opacity-50 cursor-pointer">
                                                    <BiLockAlt
                                                        onClick={() => {}}
                                                    />
                                                </span>
                                            </Tooltip>
                                            {user.active ? (
                                                <Tooltip
                                                    key={user.id + "-act"}
                                                    content="Pasif Yap"
                                                >
                                                    <span className="text-xl text-red-600 active:opacity-50 cursor-pointer">
                                                        <BiXCircle
                                                            onClick={() => {}}
                                                        />
                                                    </span>
                                                </Tooltip>
                                            ) : (
                                                <Tooltip
                                                    key={user.id + "-act"}
                                                    content="Aktif Yap"
                                                >
                                                    <span className="text-xl text-green-600 active:opacity-50 cursor-pointer">
                                                        <BiCheckCircle
                                                            onClick={() => {}}
                                                        />
                                                    </span>
                                                </Tooltip>
                                            )}
                                            <Tooltip
                                                key={user.id + "-del"}
                                                content="Sil"
                                            >
                                                <span className="text-xl text-red-600 active:opacity-50 cursor-pointer">
                                                    <BiTrash
                                                        onClick={() => {}}
                                                    />
                                                </span>
                                            </Tooltip>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <></>
                            )}
                        </>
                    );
                default:
                    return cellValue ? cellValue : "-";
            }
        },
        [currUser?.role, onOpen],
    );

    useEffect(() => {
        fetch("/api/user")
            .then((res) => res.json())
            .then((users) => {
                setUsers(users);
            });
    }, [setUsers]);

    return (
        <>
            {users ? (
                <>
                    <DataTable
                        isCompact
                        isStriped
                        className="mt-4 mb-2"
                        emptyContent="Herhangi bir kullanıcı bulunamadı!"
                        data={users || []}
                        columns={columns}
                        renderCell={renderCell}
                        sortOption={sort}
                        initialVisibleColumNames={visibleColumns}
                        activeOptions={activeOptions}
                        onAddNew={() => onOpen()}
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
                                Yeni Kullanıcı
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
                                            htmlFor="username"
                                            className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
                                        >
                                            Kullanıcı Adı
                                        </label>
                                        <input
                                            type="text"
                                            id="username"
                                            required
                                            className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                            {...register("username", {
                                                required: true,
                                                maxLength: 20,
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-semibold leading-6 text-zinc-500"
                                        >
                                            Ad
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                            {...register("username", {
                                                maxLength: 50,
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
                                        >
                                            E-Posta
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            required
                                            className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                            {...register("email", {
                                                required: true,
                                                maxLength: 50,
                                            })}
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="role"
                                            className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
                                        >
                                            Tip
                                        </label>
                                        <div className="block w-full h-10 rounded-md border-0 px-3 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2">
                                            <select
                                                id="role"
                                                required
                                                className="w-full border-none text-sm text-zinc-700 outline-none"
                                                {...register("role", {
                                                    required: true,
                                                })}
                                            >
                                                <option
                                                    disabled
                                                    selected
                                                    value=""
                                                >
                                                    Tip Seçiniz...
                                                </option>
                                                {userTypes?.map((t) => (
                                                    <option
                                                        key={t.key}
                                                        value={t.key}
                                                    >
                                                        {t.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
                                        >
                                            Şifre
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            required
                                            className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                            {...register("password", {
                                                required: true,
                                                maxLength: 30,
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="confirmPassword"
                                            className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
                                        >
                                            Şifre Tekrar
                                        </label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            required
                                            className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                            {...register("confirmPassword", {
                                                required: true,
                                                maxLength: 30,
                                                validate: (value) => {
                                                    const { password } =
                                                        getValues();
                                                    return (
                                                        password === value ||
                                                        "Girilen şifreler uyuşmuyor!"
                                                    );
                                                },
                                            })}
                                        />
                                    </div>
                                            {errors.confirmPassword?.message}
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
            ) : (
                <div className="flex flex-col mt-4">
                    <Skeleton>
                        <TableSkeleton />
                    </Skeleton>
                </div>
            )}
        </>
    );
}
