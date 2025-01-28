"use client";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Accordion, AccordionItem } from "@heroui/accordion";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/react";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    useDisclosure,
} from "@heroui/modal";

import Skeleton, { DefaultSkeleton } from "@/components/loaders/Skeleton";
import useUserStore from "@/store/user";
import { userTypes } from "@/lib/constants";
import { BiChevronLeft, BiUserCircle, BiLockAlt, BiCog } from "react-icons/bi";

interface IFormInput {
    id: number;
    name?: string;
    updatedBy?: string;
}

interface IFormInputPassword {
    id: number;
    password?: string;
    newPassword?: string;
    confirmNewPassword?: string;
    updatedBy?: string;
}

export default function Settings() {
    const { user: currUser } = useUserStore();
    const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
    const [saveSearchValue, setSaveSearchValue] = useState(false);
    const [saveCurrentPage, setSaveCurrentPage] = useState(false);

    //#region Form
    const { register, reset, handleSubmit } = useForm<IFormInput>({});
    const onSubmitUser: SubmitHandler<IFormInput> = async (data) => {
        if (!currUser) return;
        data.updatedBy = currUser.username ?? "";

        await fetch(`/api/user/${currUser.id}`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        }).then(async (res) => {
            const result = await res.json();
            if (result.ok) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
            return result;
        });
    };

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        getValues,
        setValue,
        formState: { errors },
    } = useForm<IFormInputPassword>({});
    const onSubmitPassword: SubmitHandler<IFormInputPassword> = async (
        data,
    ) => {
        if (!currUser) return;
        data.updatedBy = currUser.username ?? "";

        await fetch(`/api/user/${currUser.id}/password`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        }).then(async (res) => {
            const result = await res.json();
            if (result.ok) {
                toast.success(result.message);
                setValue("password", "");
                setValue("newPassword", "");
                setValue("confirmNewPassword", "");
                onClose();
            } else {
                toast.error(result.message);
            }
            return result;
        });
    };
    //#endregion

    useEffect(() => {
        reset(currUser);

        setSaveSearchValue(
            JSON.parse(
                window.localStorage.getItem("saveSearchValue") ?? "false",
            ),
        );
        setSaveCurrentPage(
            JSON.parse(
                window.localStorage.getItem("saveCurrentPage") ?? "false",
            ),
        );
    }, [reset, currUser]);

    if (!currUser)
        return (
            <div className="flex flex-col mt-4">
                <Skeleton>
                    <DefaultSkeleton />
                </Skeleton>
            </div>
        );
    return (
        <>
            <Accordion
                selectionMode="multiple"
                variant="splitted"
                defaultExpandedKeys={["user", "preferences"]}
                className="mt-4 !p-0"
                itemClasses={{
                    title: "font-medium text-zinc-500",
                    base: "px-4 py-3",
                }}
            >
                <AccordionItem
                    key="user"
                    aria-label="user"
                    title="Kullanıcı Bilgileri"
                    // subtitle="Kullanıcı bilgileri"
                    indicator={
                        <BiChevronLeft className="text-3xl text-zinc-500" />
                    }
                    startContent={
                        <BiUserCircle className="text-4xl text-sky-500/60" />
                    }
                >
                    <form
                        autoComplete="off"
                        onSubmit={handleSubmit(onSubmitUser)}
                    >
                        <div className="divide-y divide-zinc-200">
                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                                <dt className="font-medium">Kullanıcı Adı</dt>
                                <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                    {currUser.username || "-"}
                                </dd>
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label htmlFor="name" className="font-medium">
                                    Ad Soyad
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("name", {
                                        maxLength: 80,
                                    })}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                                <dt className="font-medium">E-Mail</dt>
                                <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                    {currUser.email || "-"}
                                </dd>
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                                <dt className="font-medium">Rol</dt>
                                <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                    {userTypes.find(
                                        (ut) => ut.key == currUser.role,
                                    )?.name || "-"}
                                </dd>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1"></div>
                            <Button
                                color="primary"
                                className="bg-sky-500"
                                onPress={() => {
                                    setValue("password", "");
                                    setValue("newPassword", "");
                                    setValue("confirmNewPassword", "");
                                    onOpen();
                                }}
                                endContent={<BiLockAlt className="text-lg" />}
                            >
                                Şifre Değiştir
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                                className="bg-green-600"
                            >
                                Değişiklikleri Kaydet
                            </Button>
                        </div>
                    </form>
                </AccordionItem>

                <AccordionItem
                    key="preferences"
                    aria-label="preferences"
                    title="Seçenekler"
                    indicator={
                        <BiChevronLeft className="text-3xl text-zinc-500" />
                    }
                    startContent={
                        <BiCog className="text-4xl text-sky-500/60" />
                    }
                >
                    <div className="divide-y divide-zinc-200">
                        <div className="flex justify-between md:grid md:grid-cols-2 w-full text-base text-zinc-500 p-2">
                            <label htmlFor="name" className="font-medium">
                                Aramalar Kalıcı Olsun
                            </label>
                            <Checkbox
                                color="default"
                                isSelected={saveSearchValue}
                                onValueChange={(value) => {
                                    window.localStorage.setItem(
                                        "saveSearchValue",
                                        JSON.stringify(value),
                                    );
                                    setSaveSearchValue(value);
                                }}
                            ></Checkbox>
                        </div>

                        <div className="flex justify-between md:grid md:grid-cols-2 w-full text-base text-zinc-500 p-2">
                            <label htmlFor="name" className="font-medium">
                                Son Sayfa Açık Kalsın
                            </label>
                            <Checkbox
                                color="default"
                                isSelected={saveCurrentPage}
                                onValueChange={(value) => {
                                    window.localStorage.setItem(
                                        "saveCurrentPage",
                                        JSON.stringify(value),
                                    );
                                    setSaveCurrentPage(value);
                                }}
                            ></Checkbox>
                        </div>
                    </div>
                </AccordionItem>
            </Accordion>

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
                        Şifre Değiştir
                    </ModalHeader>
                    <ModalBody>
                        <form
                            autoComplete="off"
                            className="flex flex-col gap-2"
                            onSubmit={handleSubmitPassword(onSubmitPassword)}
                        >
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Mevcut Şifreniz
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    required
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...registerPassword("password", {
                                        required: true,
                                        maxLength: 30,
                                        minLength: 8,
                                    })}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="newPassword"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Yeni Şifre
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    required
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...registerPassword("newPassword", {
                                        required: true,
                                        maxLength: 30,
                                        minLength: 8,
                                        validate: (value) => {
                                            const { password } = getValues();

                                            return (
                                                password !== value ||
                                                "Yeni şifreniz eski şifreyle aynı olamaz!"
                                            );
                                        },
                                    })}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="confirmNewPassword"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Yeni Şifre Tekrar
                                </label>
                                <input
                                    type="password"
                                    id="confirmNewPassword"
                                    required
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...registerPassword("confirmNewPassword", {
                                        required: true,
                                        maxLength: 30,
                                        minLength: 8,
                                        validate: (value) => {
                                            const { newPassword } = getValues();

                                            return (
                                                newPassword === value ||
                                                "Girilen şifreler uyuşmuyor!"
                                            );
                                        },
                                    })}
                                />
                            </div>
                            {
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-red-600">
                                        {errors.newPassword?.message}
                                    </p>
                                    <p className="text-sm text-red-600">
                                        {errors.confirmNewPassword?.message}
                                    </p>
                                </div>
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
