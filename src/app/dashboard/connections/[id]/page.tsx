"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { Switch } from "@nextui-org/switch";
import BoolChip from "@/components/BoolChip";
import {
    BiLinkExternal,
    BiX,
    BiShow,
    BiHide,
    BiCopy,
    BiCopyAlt,
} from "react-icons/bi";
import { faker } from "@faker-js/faker";

export default function ConnectionDetail({
    params,
}: {
    params: { id: string };
}) {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
    const pass = "12368172";

    return (
        <div className="flex flex-col gap-4">
            <Card className="mt-4 mb-2 px-1 py-2">
                <CardBody className="gap-3">
                    <div className="flex items-center gap-2 pb-2 pl-1">
                        <p className="text-3xl font-bold text-sky-500">
                            111.11.12.100
                        </p>
                        <a
                            href="http://1.1.1.1"
                            target="_blank"
                            className="cursor-pointer"
                        >
                            <BiLinkExternal className="text-2xl text-sky-500" />
                        </a>
                        <div className="flex-1"></div>
                        <BiX
                            className="text-3xl text-zinc-500 cursor-pointer active:opacity-50"
                            onClick={() => router.back()}
                        />
                    </div>
                    <div className="divide-y divide-zinc-200">
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">ID</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light gap-2 items-center mt-1 sm:mt-0">
                                {/* {faker.string.uuid()} */} Test
                            </dd>
                        </div>
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Kullanıcı</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light gap-2 items-center mt-1 sm:mt-0">
                                {/* {faker.internet.userName()} */} Test
                                <BiCopy className="text-xl text-sky-500 cursor-pointer active:opacity-50" />
                            </dd>
                        </div>

                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Şifre</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light gap-2 items-center mt-1 sm:mt-0">
                                <p
                                    className={
                                        showPassword
                                            ? "tracking-wide"
                                            : "tracking-tighter"
                                    }
                                >
                                    {showPassword
                                        ? pass
                                        : pass.replace(/./g, "●")}
                                </p>
                                {showPassword ? (
                                    <BiHide
                                        className="text-2xl cursor-pointer active:opacity-50"
                                        onClick={() => setShowPassword(false)}
                                    />
                                ) : (
                                    <BiShow
                                        className="text-2xl cursor-pointer active:opacity-50"
                                        onClick={() => setShowPassword(true)}
                                    />
                                )}
                                <BiCopy className="text-xl text-sky-500 cursor-pointer active:opacity-50" />
                            </dd>
                        </div>
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Aktif</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light gap-2 items-center mt-1 sm:mt-0">
                                <BoolChip value={true} />
                            </dd>
                        </div>
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Not</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light gap-2 items-center mt-1 sm:mt-0">
                                {/* {faker.lorem.paragraph(5)} */} Test
                            </dd>
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="flex gap-2">
                    <div className="flex-1"></div>
                    <Button
                        color="primary"
                        className="bg-red-500"
                        // onPress={onOpen}
                    >
                        Sil
                    </Button>
                    <Button
                        color="primary"
                        className="bg-sky-500"
                        onPress={onOpen}
                    >
                        Düzenle
                    </Button>
                </CardFooter>
            </Card>
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
                        Düzenle
                    </ModalHeader>
                    <ModalBody>
                        <form
                            action=""
                            autoComplete="off"
                            className="flex flex-col gap-3"
                        >
                            <div className="">
                                <label
                                    htmlFor="active"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Aktif
                                </label>
                                <div className="mt-2">
                                    <Switch name="active" id="ip" />
                                </div>
                            </div>
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
                                            name="ip"
                                            id="ip"
                                            autoComplete="ip"
                                            required
                                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-zinc-700 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
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
                                        // name="login"
                                        id="login"
                                        required
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
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
                                        // name="password"
                                        id="password"
                                        autoComplete="off"
                                        required
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
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
                                        name="note"
                                        id="note"
                                        rows={3}
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row gap-2 mt-4">
                                <div className="flex-1"></div>
                                <Button
                                    color="danger"
                                    onPress={onClose}
                                    className="bg-red-500"
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
        </div>
    );
}
