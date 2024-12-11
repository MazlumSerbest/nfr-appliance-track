import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { Accordion, AccordionItem } from "@nextui-org/accordion";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";

import {
    BiChevronLeft,
    BiEdit,
    BiInfoCircle,
    BiMapPin,
    BiPlus,
    BiTrash,
} from "react-icons/bi";
import useUserStore from "@/store/user";
import RegInfo from "../buttons/RegInfo";
import DeleteButton from "../buttons/DeleteButton";
import toast from "react-hot-toast";
import { currentTypes } from "@/lib/constants";
import { newAddress, updateAddress } from "@/lib/prisma";

interface IFormInput {
    id: number;
    currentId: number;
    name: string;
    address: string;
    city: string;
    createdBy: string;
    updatedBy?: string;
}

type Props = {
    currentId: number;
    currentType: string;
    addressList: Address[];
    mutate: () => void;
};

export default function Addresses(props: Props) {
    const { currentId, currentType, addressList, mutate } = props;
    const [isNew, setIsNew] = useState(false);
    const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
    const { user: currUser } = useUserStore();

    //#region Form
    const { register, reset, resetField, handleSubmit, control } =
        useForm<IFormInput>();

    const onSubmitNew: SubmitHandler<IFormInput> = async (data: any) => {
        data.createdBy = currUser?.username ?? "";
        data.currentId = currentId;

        const res = await newAddress(data, currUser?.username);
        if (res) {
            onClose();
            reset({});
            mutate();
            toast.success("Adres eklendi!");
        } else toast.error("Bir hata oluştu! Lütfen tekrar deneyiniz.");
    };
    const onSubmitUpdate: SubmitHandler<IFormInput> = async (data: any) => {
        data.updatedBy = currUser?.username ?? "";
        data.currentId = currentId;

        const res = await updateAddress(data, currUser?.username);
        if (res) {
            onClose();
            reset({});
            mutate();
            toast.success("Adres güncellendi!");
        } else toast.error("Bir hata oluştu! Lütfen tekrar deneyiniz.");
    };
    //#endregion

    return (
        <>
            <Accordion
                selectionMode="multiple"
                variant="splitted"
                defaultExpandedKeys={addressList.length ? ["address"] : []}
                className="!p-0"
                itemClasses={{
                    title: "font-medium text-zinc-600",
                    base: "px-4 py-3",
                }}
            >
                <AccordionItem
                    key="address"
                    aria-label="Address"
                    title="Adres Bilgileri"
                    subtitle={`Bu ${currentTypes
                        .find((e) => e.key == currentType)
                        ?.name.toLowerCase()}ye tanımlanmış adres bilgileri`}
                    indicator={
                        <BiChevronLeft className="text-3xl text-zinc-500" />
                    }
                    startContent={
                        <BiMapPin className="text-4xl text-yellow-600/60" />
                    }
                >
                    {addressList.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            <ul
                                role="list"
                                className="divide-y divide-zinc-200"
                            >
                                <li></li>
                                {addressList.map((a: Address) => (
                                    <>
                                        <li
                                            key={a.id}
                                            className="flex justify-between py-2 items-center"
                                        >
                                            <div className="flex flex-1 gap-x-4">
                                                <div className="flex flex-col min-w-0 text-sm leading-5 text-zinc-500">
                                                    <p className="text-base font-semibold leading-6 text-zinc-600">
                                                        {a.name}
                                                        {a.city ? (
                                                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-600/20 ml-2">
                                                                {a.city}
                                                            </span>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </p>

                                                    <div className="flex flex-row gap-2">
                                                        <p>{a.address}</p>
                                                    </div>
                                                </div>
                                                <div className="flex-1"></div>
                                                <div className="flex justify-start items-center gap-2">
                                                    <RegInfo
                                                        data={a}
                                                        trigger={
                                                            <span>
                                                                <BiInfoCircle />
                                                            </span>
                                                        }
                                                    />
                                                    <Tooltip
                                                        key={a.id + "-edit"}
                                                        content="Düzenle"
                                                    >
                                                        <span className="text-xl text-green-600 active:opacity-50 cursor-pointer">
                                                            <BiEdit
                                                                onClick={() => {
                                                                    setIsNew(
                                                                        false,
                                                                    );
                                                                    reset(a);
                                                                    onOpen();
                                                                }}
                                                            />
                                                        </span>
                                                    </Tooltip>
                                                    <DeleteButton
                                                        table="addresses"
                                                        data={a}
                                                        mutate={mutate}
                                                        trigger={
                                                            <span>
                                                                <BiTrash />
                                                            </span>
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </li>
                                    </>
                                ))}
                            </ul>
                            <div className="flex gap-2">
                                <div className="flex-1"></div>
                                <Button
                                    color="primary"
                                    className="bg-sky-500"
                                    endContent={<BiPlus />}
                                    onPress={() => {
                                        setIsNew(true);
                                        reset({});
                                        reset({});
                                        onOpen();
                                    }}
                                >
                                    Adres Ekle
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full py-6 text-center">
                            <p className="text-zinc-400">
                                {`Bu ${currentTypes
                                    .find((e) => e.key == currentType)
                                    ?.name.toLowerCase()}ye herhangi bir adres tanımlanmamıştır.`}
                            </p>
                            <Button
                                color="primary"
                                className="bg-sky-500 mt-3"
                                endContent={<BiPlus />}
                                onPress={() => {
                                    setIsNew(true);
                                    reset({});
                                    onOpen();
                                }}
                            >
                                Adres Ekle
                            </Button>
                        </div>
                    )}
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
                        {isNew ? "Yeni Adres" : "Adres Güncelle"}
                    </ModalHeader>
                    <ModalBody>
                        <form
                            action=""
                            autoComplete="off"
                            className="flex flex-col gap-3"
                            onSubmit={handleSubmit(
                                isNew ? onSubmitNew : onSubmitUpdate,
                            )}
                        >
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Ad
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...register("name", {
                                        required: true,
                                        maxLength: 80,
                                    })}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="city"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Şehir
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...register("city", {
                                        maxLength: 80,
                                    })}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="address"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Adres
                                </label>
                                <div className="mt-2">
                                    <textarea
                                        id="address"
                                        rows={3}
                                        required
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                        {...register("address", {
                                            required: true,
                                            maxLength: 500,
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
