import { useState } from "react";
import { Tooltip } from "@heroui/tooltip";

import {
    BiLoaderAlt,
    BiCheckSquare,
    BiSquare,
} from "react-icons/bi";
import toast from "react-hot-toast";

type Props = {
    data: any;
    mutate: () => void;
};

export default function ControlButton({ data, mutate }: Props) {
    const [submitting, setSubmitting] = useState(false);

    return (
        <>
            {submitting ? (
                <BiLoaderAlt className="animate-spin text-2xl text-sky-400" />
            ) : data.controlled ? (
                <Tooltip key={data.id + "-cont"} content="Gözetimli">
                    <span className="text-2xl text-green-600 active:opacity-50 cursor-pointer">
                        <BiCheckSquare
                            onClick={async () => {
                                setSubmitting(true);

                                await fetch(
                                    `/api/connection/${data.id}/control?controlled=false`,
                                    {
                                        method: "PUT",
                                    },
                                ).then(async (res) => {
                                    const result = await res.json();
                                    if (result.ok) {
                                        toast.success(result.message);
                                        mutate();
                                    } else {
                                        toast.error(result.message);
                                    }

                                    setSubmitting(false);
                                    return result;
                                });
                            }}
                        />
                    </span>
                </Tooltip>
            ) : (
                <Tooltip key={data.id + "-cont"} content="Gözetimsiz">
                    <span className="text-2xl text-gray-400 active:opacity-50 cursor-pointer">
                        <BiSquare
                            onClick={async () => {
                                setSubmitting(true);

                                await fetch(
                                    `/api/connection/${data.id}/control?controlled=true`,
                                    {
                                        method: "PUT",
                                    },
                                ).then(async (res) => {
                                    const result = await res.json();
                                    if (result.ok) {
                                        toast.success(result.message);
                                        mutate();
                                    } else {
                                        toast.error(result.message);
                                    }

                                    setSubmitting(false);
                                    return result;
                                });
                            }}
                        />
                    </span>
                </Tooltip>
            )}
        </>
    );
}
