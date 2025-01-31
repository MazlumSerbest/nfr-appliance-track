import toast from "react-hot-toast";
import { Tooltip } from "@heroui/tooltip";
import { BiCheckCircle, BiXCircle } from "react-icons/bi";
import useUserStore from "@/store/user";
import { setActiveStatus } from "@/lib/prisma";

type Props = {
    table:
        | "users"
        | "brands"
        | "products"
        | "productTypes"
        | "licenseTypes"
        | "boughtTypes"
        | "currents";
    data: any;
    mutate?: () => void;
};

export default function ActiveButton({ table, data, mutate }: Props) {
    const { user: currUser } = useUserStore();

    return (
        <>
            {data.active ? (
                <Tooltip key={data.id + "-act"} content="Pasif Yap">
                    <span className="text-xl text-red-600 active:opacity-50 cursor-pointer">
                        <BiXCircle
                            onClick={async () => {
                                const res = await setActiveStatus(
                                    table,
                                    data.id,
                                    false,
                                    currUser?.username,
                                );

                                if (res) {
                                    toast.success("Kayıt güncellendi!");
                                    mutate ? mutate() : null;
                                } else
                                    toast.error(
                                        "Bir hata oluştu! Lütfen tekrar deneyiniz.",
                                    );
                            }}
                        />
                    </span>
                </Tooltip>
            ) : (
                <Tooltip key={data.id + "-act"} content="Aktif Yap">
                    <span className="text-xl text-green-600 active:opacity-50 cursor-pointer">
                        <BiCheckCircle
                            onClick={async () => {
                                const res = await setActiveStatus(
                                    table,
                                    data.id,
                                    true,
                                    currUser?.username,
                                );

                                if (res) {
                                    toast.success("Kayıt güncellendi!");
                                    mutate ? mutate() : null;
                                } else
                                    toast.error(
                                        "Bir hata oluştu! Lütfen tekrar deneyiniz.",
                                    );
                            }}
                        />
                    </span>
                </Tooltip>
            )}
        </>
    );
}
