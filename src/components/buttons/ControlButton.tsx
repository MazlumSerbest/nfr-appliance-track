import toast from "react-hot-toast";
import { Tooltip } from "@heroui/tooltip";
import { BiCheckSquare, BiSquare } from "react-icons/bi";
import useUserStore from "@/store/user";
import { setControlStatus } from "@/lib/prisma";

type Props = {
    data: any;
    mutate?: () => void;
};

export default function ControlButton(props: Props) {
    const { data, mutate } = props;
    const { user: currUser } = useUserStore();

    return (
        <>
            {data.controlled ? (
                <Tooltip key={data.id + "-cont"} content="Gözetimli">
                    <span className="text-xl text-green-600 active:opacity-50 cursor-pointer">
                        <BiCheckSquare
                            onClick={async () => {
                                const res = await setControlStatus(
                                    data.id,
                                    false,
                                    currUser?.username,
                                );

                                if (res) {
                                    toast.success("Bağlantı güncellendi!");
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
                <Tooltip key={data.id + "-cont"} content="Gözetimsiz">
                    <span className="text-xl text-gray-400 active:opacity-50 cursor-pointer">
                        <BiSquare
                            onClick={async () => {
                                const res = await setControlStatus(
                                    data.id,
                                    true,
                                    currUser?.username,
                                );

                                if (res) {
                                    toast.success("Bağlantı güncellendi!");
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
