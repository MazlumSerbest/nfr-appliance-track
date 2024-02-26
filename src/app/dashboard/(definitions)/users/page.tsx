"use client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
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
import { Switch } from "@nextui-org/switch";
import { Button } from "@nextui-org/button";

import Skeleton, { TableSkeleton } from "@/components/loaders/Skeleton";
import DataTable from "@/components/DataTable";
import BoolChip from "@/components/BoolChip";
import DeleteButton from "@/components/buttons/DeleteButton";
import RegInfo from "@/components/buttons/RegInfo";
import { BiInfoCircle, BiTrash } from "react-icons/bi";
import { DateTimeFormat } from "@/utils/date";
import { activeOptions, userTypes } from "@/lib/constants";
import useUserStore from "@/store/user";

interface IFormInput {
    id: number;
    active: boolean;
    username: string;
    name?: string;
    email: string;
    role: string;
    password?: string;
    confirmPassword?: string;
    createdBy: string;
    updatedBy?: string;
}

export default function Users() {
    const [users, setUsers] = useState();
    const [isNew, setIsNew] = useState(false);
    const { user: currUser } = useUserStore();
    const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

    const { data, error, mutate } = useSWR("/api/user", null, {
        onSuccess: (data) => {
            const users = data.filter((e: User) => e.username != "admin");
            setUsers(users);
        },
    });

    //#region Form
    const {
        register,
        reset,
        handleSubmit,
        getValues,
        formState: { errors },
        control,
    } = useForm<IFormInput>({ defaultValues: { active: true, role: "user" } });
    const onSubmitNew: SubmitHandler<IFormInput> = async (data) => {
        data.createdBy = currUser?.username ?? "";
        delete data["confirmPassword"];

        await fetch("/api/user", {
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
        delete data["confirmPassword"];

        await fetch(`/api/user/${data.id}`, {
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
            searchable: true,
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
                case "role":
                    return userTypes?.find((t) => t.key == cellValue)?.name;
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
                                            <RegInfo
                                                data={user}
                                                trigger={
                                                    <span>
                                                        <BiInfoCircle />
                                                    </span>
                                                }
                                            />
                                            {/* <Tooltip
                                                key={user.id + "-pass"}
                                                content="Şifre Değiştir"
                                            >
                                                <span className="text-xl text-sky-500 active:opacity-50 cursor-pointer">
                                                    <BiLockAlt
                                                        onClick={() => {}}
                                                    />
                                                </span>
                                            </Tooltip> */}
                                            <DeleteButton
                                                table="users"
                                                data={user}
                                                mutate={mutate}
                                                trigger={
                                                    <span>
                                                        <BiTrash />
                                                    </span>
                                                }
                                            />
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
        [currUser?.role, mutate],
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
                emptyContent="Herhangi bir kullanıcı bulunamadı!"
                data={users || []}
                columns={columns}
                renderCell={renderCell}
                sortOption={sort}
                initialVisibleColumNames={visibleColumns}
                activeOptions={activeOptions}
                onAddNew={
                    currUser?.role == "admin"
                        ? () => {
                              setIsNew(true);
                              reset({});
                              reset({});
                              onOpen();
                          }
                        : undefined
                }
                onDoubleClick={
                    currUser?.role == "admin"
                        ? (user) => {
                              setIsNew(false);
                              reset(user);
                              onOpen();
                          }
                        : undefined
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
                        {isNew ? "Yeni Kullanıcı" : "Kullanıcı Güncelle"}
                    </ModalHeader>
                    <ModalBody>
                        <form
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

                            {isNew ? (
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
                                            maxLength: 30,
                                            minLength: 4,
                                        })}
                                    />
                                </div>
                            ) : (
                                <></>
                            )}

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
                                    {...register("name", {
                                        maxLength: 80,
                                    })}
                                />
                            </div>
                            {isNew ? (
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
                                            maxLength: 80,
                                        })}
                                    />
                                </div>
                            ) : (
                                <></>
                            )}

                            <div>
                                <label
                                    htmlFor="role"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Rol
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
                                        <option disabled selected value="">
                                            Rol Seçiniz...
                                        </option>
                                        {userTypes?.map((t) => (
                                            <option key={t.key} value={t.key}>
                                                {t.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {isNew ? (
                                <>
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
                                                minLength: 8,
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
                                                minLength: 8,
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
                                </>
                            ) : (
                                <></>
                            )}
                            {
                                <p className="text-base text-red-600">
                                    {errors.confirmPassword?.message}
                                </p>
                            }
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
