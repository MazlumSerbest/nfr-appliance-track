import { useState } from "react";
import toast from "react-hot-toast";

import { useDisclosure } from "@heroui/react";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";
import { BiPackage } from "react-icons/bi";

import useUserStore from "@/store/user";

type Props = {
    type: "appliance" | "license";
    entityId: number;
    data: any;
};

export default function OrderButton({ type, entityId, data }: Props) {
    const { isOpen, onClose, onOpenChange } = useDisclosure();
    const [submitting, setSubmitting] = useState(false);
    const { user: currUser } = useUserStore();

    return (
        <Popover
            key={data.id}
            placement="top"
            color="default"
            backdrop="opaque"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <Tooltip content="Sipariş Oluştur">
                <span>
                    <PopoverTrigger>
                        <Button
                            type="button"
                            color="primary"
                            className="bg-indigo-500"
                            radius="sm"
                            isIconOnly
                        >
                            <BiPackage className="size-5" />
                        </Button>
                    </PopoverTrigger>
                </span>
            </Tooltip>
            <PopoverContent className="flex flex-col gap-2 p-3">
                <h2 className="text-lg font-semibold text-zinc-600">
                    Seçili kayıdın siparişi oluşturulacaktır!
                </h2>
                <p className="text-sm text-zinc-500 pb-2">
                    Devam etmek istediğinizden emin misiniz?
                </p>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="bordered"
                        color="default"
                        onPress={onClose}
                    >
                        Kapat
                    </Button>
                    <Button
                        type="button"
                        isLoading={submitting}
                        color="primary"
                        className="bg-green-600"
                        onPress={async () => {
                            setSubmitting(true);
                            let order: any = {
                                createdBy: currUser?.username,
                                soldAt: data.soldAt,
                                boughtAt: data.boughtAt,
                                cusName: data.cusName,
                                customerId: data.customerId,
                                dealerId: data.dealerId,
                                subDealerId: data.subDealerId,
                                supplierId: data.supplierId,
                                invoiceCurrentId: data.invoiceCurrentId,
                            };

                            if (type === "appliance") {
                                order.applianceId = entityId;
                                order.type = "standard";
                            } else {
                                order.licenseId = entityId;
                                order.type = "license";
                            }

                            await fetch(`/api/order`, {
                                method: "POST",
                                body: JSON.stringify(order),
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            }).then(async (res) => {
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
                        Sipariş Oluştur
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
