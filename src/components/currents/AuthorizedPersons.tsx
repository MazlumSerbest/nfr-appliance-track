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
    BiMailSend,
    BiPhoneOutgoing,
    BiPlus,
    BiTrash,
    BiUserVoice,
} from "react-icons/bi";
import useUserStore from "@/store/user";
import RegInfo from "../buttons/RegInfo";
import DeleteButton from "../buttons/DeleteButton";
import toast from "react-hot-toast";
import { currentTypes } from "@/lib/constants";
import { newAuthorizedPerson, updateAuthorizedPerson } from "@/lib/prisma";

interface IFormInput {
    id: number;
    currentId: number;
    isMain: boolean;
    name: string;
    title: string;
    phone: string;
    email: string;
    createdBy: string;
    updatedBy?: string;
}

type Props = {
    currentId: number;
    currentType: string;
    personList: AuthorizedPerson[];
    mutate: () => void;
};

export default function AuthorizedPersons(props: Props) {
    const { currentId, currentType, personList, mutate } = props;
    const [isNew, setIsNew] = useState(false);
    const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
    const { user: currUser } = useUserStore();

    //#region Form
    const { register, reset, resetField, handleSubmit, control } =
        useForm<IFormInput>();

    const onSubmitNew: SubmitHandler<IFormInput> = async (data: any) => {
        data.createdBy = currUser?.username ?? "";
        data.currentId = currentId;

        const res = await newAuthorizedPerson(data, currUser?.username);
        if (res) {
            onClose();
            reset({});
            mutate();
            toast.success("Yetkili eklendi!");
        } else toast.error("Bir hata oluştu! Lütfen tekrar deneyiniz.");
    };
    const onSubmitUpdate: SubmitHandler<IFormInput> = async (data: any) => {
        data.updatedBy = currUser?.username ?? "";
        data.currentId = currentId;

        const res = await updateAuthorizedPerson(data, currUser?.username);
        if (res) {
            onClose();
            reset({});
            mutate();
            toast.success("Yetkili güncellendi!");
        } else toast.error("Bir hata oluştu! Lütfen tekrar deneyiniz.");
    };
    //#endregion

    return (
        <>
            <Accordion
                selectionMode="multiple"
                variant="splitted"
                defaultExpandedKeys={personList.length ? ["authorized"] : []}
                className="p-0"
                itemClasses={{
                    title: "font-medium text-zinc-600",
                    base: "px-1 py-2",
                }}
            >
                <AccordionItem
                    key="authorized"
                    aria-label="Authorized"
                    title="Yetkili Bilgileri"
                    subtitle={`Bu ${currentTypes
                        .find((e) => e.key == currentType)
                        ?.name.toLowerCase()}ye tanımlanmış yetkili bilgileri`}
                    indicator={
                        <BiChevronLeft className="text-3xl text-zinc-500" />
                    }
                    startContent={
                        <BiUserVoice className="text-4xl text-green-600/60" />
                    }
                >
                    {personList.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            <ul
                                role="list"
                                className="divide-y divide-zinc-200"
                            >
                                <li></li>
                                {personList
                                    .sort(
                                        (a, b) =>
                                            Number(b.isMain) - Number(a.isMain),
                                    )
                                    .map((ap: AuthorizedPerson) => (
                                        <>
                                            <li
                                                key={ap.id}
                                                className="flex justify-between py-2 items-center"
                                            >
                                                <div className="flex flex-1 gap-x-4">
                                                    <div className="flex flex-col min-w-0 text-sm leading-5 text-zinc-500">
                                                        <p className="text-base font-semibold leading-6 text-zinc-600">
                                                            {ap.name}
                                                            {ap.title ? (
                                                                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-600/20 ml-2">
                                                                    {ap.title}
                                                                </span>
                                                            ) : (
                                                                <></>
                                                            )}
                                                            {/* {ap.isMain ? (
                                                                <span className="inline-flex items-center rounded-md bg-sky-50 px-2 py-1 text-xs font-medium text-sky-600 ring-1 ring-inset ring-sky-600/20 ml-2">
                                                                    Ana Yetkili
                                                                </span>
                                                            ) : (
                                                                <></>
                                                            )} */}
                                                        </p>
                                                        {ap.phone ? (
                                                            <div className="flex flex-row gap-2 mt-2 mb-1">
                                                                <p>
                                                                    {"+90" +
                                                                        ap.phone}
                                                                </p>
                                                                <a
                                                                    href={`tel:${
                                                                        "+90" +
                                                                        ap.phone
                                                                    }`}
                                                                >
                                                                    <BiPhoneOutgoing className="text-xl text-green-600 cursor-pointer active:opacity-50" />
                                                                </a>
                                                            </div>
                                                        ) : (
                                                            <></>
                                                        )}
                                                        {ap.email ? (
                                                            <div className="flex flex-row gap-2">
                                                                <p>
                                                                    {ap.email}
                                                                </p>
                                                                <a
                                                                    href={`mailto:${ap.email}`}
                                                                >
                                                                    <BiMailSend className="text-xl text-sky-500 cursor-pointer active:opacity-50" />
                                                                </a>
                                                            </div>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </div>
                                                    <div className="flex-1"></div>
                                                    <div className="flex justify-start items-center gap-2">
                                                        {/* {!ap.isMain ? (
                                                            <Tooltip
                                                                key={
                                                                    ap.id +
                                                                    "-main"
                                                                }
                                                                content="Ana Yetkili Yap"
                                                            >
                                                                <span className="text-xl text-sky-500 active:opacity-50 cursor-pointer">
                                                                    <BiUserVoice
                                                                        onClick={async () => {
                                                                            const res =
                                                                                await setMainAuthorizedPerson(
                                                                                    currentId,
                                                                                    ap.id,
                                                                                    currUser?.username,
                                                                                );
                                                                            if (
                                                                                res
                                                                            ) {
                                                                                toast.success(
                                                                                    "Ana yetkili değiştirildi!",
                                                                                );
                                                                                mutate();
                                                                            } else
                                                                                toast.error(
                                                                                    "Bir hata oluştu! Lütfen tekrar deneyiniz.",
                                                                                );
                                                                        }}
                                                                    />
                                                                </span>
                                                            </Tooltip>
                                                        ) : (
                                                            <></>
                                                        )} */}
                                                        <RegInfo
                                                            data={ap}
                                                            trigger={
                                                                <span>
                                                                    <BiInfoCircle />
                                                                </span>
                                                            }
                                                        />
                                                        <Tooltip
                                                            key={
                                                                ap.id + "-edit"
                                                            }
                                                            content="Düzenle"
                                                        >
                                                            <span className="text-xl text-green-600 active:opacity-50 cursor-pointer">
                                                                <BiEdit
                                                                    onClick={() => {
                                                                        setIsNew(
                                                                            false,
                                                                        );
                                                                        reset(
                                                                            ap,
                                                                        );
                                                                        onOpen();
                                                                    }}
                                                                />
                                                            </span>
                                                        </Tooltip>
                                                        <DeleteButton
                                                            table="authorizedPersons"
                                                            data={ap}
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
                                    Yetkili Ekle
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full py-6 text-center">
                            <p className="text-zinc-400">
                                {`Bu ${currentTypes
                                    .find((e) => e.key == currentType)
                                    ?.name.toLowerCase()}ye herhangi bir yetkili tanımlanmamıştır.`}
                            </p>
                            <Button
                                color="primary"
                                className="bg-sky-500 mt-3"
                                endContent={<BiPlus />}
                                onPress={() => {
                                    setIsNew(true);
                                    reset({ isMain: true });
                                    onOpen();
                                }}
                            >
                                Yetkili Ekle
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
                        {isNew ? "Yeni Yetkili" : "Yetkili Güncelle"}
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
                                        maxLength: 50,
                                    })}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Görev
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...register("title", {
                                        maxLength: 50,
                                    })}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Telefon
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:max-w-md">
                                        <span className="flex select-none items-center pl-3 text-zinc-400 sm:text-sm">
                                            +90
                                        </span>
                                        <input
                                            type="text"
                                            id="phone"
                                            required
                                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-zinc-700 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
                                            {...register("phone", {
                                                required: true,
                                                maxLength: 20,
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    E-Posta
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...register("email", {
                                        maxLength: 50,
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
