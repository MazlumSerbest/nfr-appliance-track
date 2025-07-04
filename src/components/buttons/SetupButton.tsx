import { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import toast from "react-hot-toast";

import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
} from "@heroui/modal";

import AutoComplete from "@/components/AutoComplete";

import { BiTask } from "react-icons/bi";
import { getUsers } from "@/lib/data";
import useUserStore from "@/store/user";

interface IFormInput {
    status: "waiting" | "complete";
    type: "appliance" | "license";
    userId: number;
    licenseId?: number;
    applianceId?: number;
    note?: string;
    createdBy: string;
}

type Props = {
    type: "appliance" | "license";
    entityId: number;
};

export default function SetupButton({ type, entityId }: Props) {
    const { user: currUser } = useUserStore();

    const [submitting, setSubmitting] = useState(false);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [users, setUsers] = useState<ListBoxItem[] | null>(null);

    //#region Form
    const { register, reset, handleSubmit, control, setValue } =
        useForm<IFormInput>({});

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setSubmitting(true);
        data.createdBy = currUser?.username ?? "";
        data.status = "waiting";
        data.type = type;
        type === "license"
            ? (data.licenseId = entityId)
            : (data.applianceId = entityId);

        await fetch("/api/setup", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        }).then(async (res) => {
            const result = await res.json();
            if (result.ok) {
                toast.success(result.message);
                onClose();
                reset();
            } else {
                toast.error(result.message);
            }

            setSubmitting(false);
            return result;
        });
    };
    //#endregion

    //#region Data
    async function getData() {
        const users: ListBoxItem[] = await getUsers(true, currUser);
        setUsers(users);
    }

    useEffect(() => {
        getData();
    }, []);
    //#endregion

    return (
        <>
            <Tooltip content="Kurulum Ekle">
                <Button
                    color="primary"
                    className="text-white bg-zinc-400"
                    onPress={onOpen}
                    radius="sm"
                    isIconOnly
                >
                    <BiTask className="text-xl" />
                </Button>
            </Tooltip>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="xl"
                placement="center"
                backdrop="opaque"
                shadow="lg"
                isDismissable={false}
                scrollBehavior="outside"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-zinc-500">
                        Yeni Kurulum
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
                                    htmlFor="userId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Kullanıcı
                                </label>
                                <Controller
                                    control={control}
                                    name="userId"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <AutoComplete
                                            onChange={onChange}
                                            value={value}
                                            data={users || []}
                                        />
                                    )}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="note"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                                >
                                    Not
                                </label>
                                <div className="mt-2">
                                    <textarea
                                        id="note"
                                        rows={3}
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                        {...register("note", {
                                            maxLength: 500,
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
                                    isLoading={submitting}
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
