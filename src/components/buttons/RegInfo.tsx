import { ReactNode } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Tooltip } from "@nextui-org/tooltip";
import { DateTimeFormat } from "@/utils/date";

type Props = {
    data: any;
    trigger: ReactNode;
};

export default function RegInfo(props: Props) {
    let { data, trigger } = props;

    return (
        <Popover
            key={data.id}
            placement="top"
            color="default"
            backdrop="opaque"
        >
            <Tooltip key={data.id + "-info"} content="Kayıt Bilgisi">
                <span className="text-xl text-zinc-500 active:opacity-50 cursor-pointer flex items-center">
                    <PopoverTrigger>{trigger}</PopoverTrigger>
                </span>
            </Tooltip>
            <PopoverContent>
                <div className="flex flex-col px-1 py-2 divide-y divide-zinc-200 text-zinc-700 text-sm">
                    <div className="grid grid-cols-2">
                        <div className="font-bold">ID</div>
                        <div className="ml-2">{data.id}</div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="font-bold">Oluşturan Kullanıcı</div>
                        <div className="ml-2">{data.createdBy}</div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="font-bold">Oluşturulma Tarihi</div>
                        <div className="ml-2">
                            {DateTimeFormat(data.createdAt)}
                        </div>
                    </div>
                    {data.updatedBy ? (
                        <>
                            <div className="grid grid-cols-2">
                                <div className="font-bold">
                                    Güncelleyen Kullanıcı
                                </div>
                                <div className="ml-2">{data.updatedBy}</div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div className="font-bold">
                                    Güncellenme Tarihi
                                </div>
                                <div className="ml-2">
                                    {DateTimeFormat(data.updatedAt)}
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            </PopoverContent>
        </Popover>
    );
}
