import { useState } from "react";

import { useDisclosure } from "@heroui/react";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";

import { BiLockOpen } from "react-icons/bi";
import useUserStore from "@/store/user";
import toast from "react-hot-toast";

type Props = {
    userId: number;
};

export default function ResetButton({ userId }: Props) {
    const { isOpen, onClose, onOpenChange } = useDisclosure();
    const [submitting, setSubmitting] = useState(false);
    const { user: currUser } = useUserStore();

    if (currUser?.role == "technical") return null;
    return (
        <Popover
            key={userId}
            placement="top"
            color="default"
            backdrop="opaque"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <Tooltip key={userId + "-pass"} content="Şifre Sıfırla">
                <span className="text-xl text-sky-500 active:opacity-50 cursor-pointer flex items-center">
                    <PopoverTrigger>
                        <span>
                            <BiLockOpen />
                        </span>
                    </PopoverTrigger>
                </span>
            </Tooltip>
            <PopoverContent className="flex flex-col gap-2 p-3">
                <h2 className="text-lg font-semibold text-zinc-600">
                    Seçili kullanıcının şifresi sıfırlanacaktır!
                </h2>
                <p className="text-sm text-zinc-500 pb-2">
                    Devam etmek istediğinizden emin misiniz?
                </p>
                <div className="flex gap-2">
                    <Button variant="bordered" onPress={onClose}>
                        Kapat
                    </Button>
                    <Button
                        isLoading={submitting}
                        variant="solid"
                        color="danger"
                        className="bg-red-600"
                        onPress={async () => {
                            setSubmitting(true);

                            await fetch(
                                `/api/user/${userId}/password?reset=true`,
                                {
                                    method: "PUT",
                                    body: JSON.stringify({
                                        updatedBy: currUser?.username,
                                    }),
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                },
                            ).then(async (res) => {
                                const result = await res.json();
                                if (result.ok) {
                                    toast.success(result.message);
                                } else {
                                    toast.error(result.message);
                                }
                                onClose();
                                setSubmitting(false);
                                return result;
                            });
                        }}
                    >
                        Sıfırla
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
