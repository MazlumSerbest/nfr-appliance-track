import { ReactNode, useState } from "react";

import { useDisclosure } from "@heroui/react";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";

import toast from "react-hot-toast";
import { deleteData } from "@/lib/prisma";
import useUserStore from "@/store/user";

type Props = {
    table:
        | "appliances"
        | "licenses"
        | "orders"
        | "projects"
        | "connections"
        | "setups"
        | "users"
        | "brands"
        | "products"
        | "productTypes"
        | "licenseTypes"
        | "boughtTypes"
        | "currents"
        | "authorizedPersons"
        | "addresses"
        | "licenseHistory"
        | "applianceHistory";
    data: any;
    trigger: ReactNode;
    isButton?: boolean;
    router?: any;
    mutate?: () => void;
};

export default function DeleteButton({
    table,
    data,
    trigger,
    isButton = false,
    router,
    mutate,
}: Props) {
    const { isOpen, onClose, onOpenChange } = useDisclosure();
    const [submitting, setSubmitting] = useState(false);
    const { user: currUser } = useUserStore();

    if (currUser?.role == "technical" && table != "connections") return null;
    return (
        <Popover
            key={data.id}
            placement="top"
            color="default"
            backdrop="opaque"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            {isButton ? (
                <PopoverTrigger>{trigger}</PopoverTrigger>
            ) : (
                <Tooltip key={data.id + "-del"} content="Sil">
                    <span className="text-xl text-red-600 active:opacity-50 cursor-pointer flex items-center">
                        <PopoverTrigger>{trigger}</PopoverTrigger>
                    </span>
                </Tooltip>
            )}
            <PopoverContent className="flex flex-col gap-2 p-3">
                <h2 className="text-lg font-semibold text-zinc-600">
                    Seçili kayıt silinecektir!
                </h2>
                <p className="text-sm text-zinc-500 pb-2">
                    Devam etmek istediğinizden emin misiniz?
                </p>
                <div className="flex gap-2">
                    <Button
                        variant="bordered"
                        color="default"
                        onPress={onClose}
                    >
                        Kapat
                    </Button>
                    <Button
                        isLoading={submitting}
                        variant="solid"
                        color="danger"
                        className="bg-red-600"
                        onPress={async () => {
                            setSubmitting(true);

                            const res = await deleteData(
                                table,
                                data.id,
                                currUser?.username,
                            );
                            if (res) {
                                toast.success("Kayıt silindi!");
                                onClose();
                                if (isButton) router.back();
                                else mutate ? mutate() : null;
                            } else
                                toast.error(
                                    "Bir hata oluştu! Lütfen tekrar deneyiniz.",
                                );

                            setSubmitting(false);
                        }}
                    >
                        Sil
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
