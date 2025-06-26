import { useState } from "react";
import { Tooltip } from "@heroui/tooltip";

import {
    BiCheckSquare,
    BiLoaderAlt,
    BiSolidXSquare,
} from "react-icons/bi";
import toast from "react-hot-toast";

type Props = {
    data: any;
    mutate: () => void;
};

export default function BlacklistButton({ data, mutate }: Props) {
    const [submitting, setSubmitting] = useState(false);

    return (
        <>
            {submitting ? (
                <BiLoaderAlt className="animate-spin text-2xl text-sky-400" />
            ) : data.blacklisted ? (
                <Tooltip key={data.id + "-black"} content="Kara Listede">
                    <span className="text-2xl text-red-600 active:opacity-50 cursor-pointer">
                        <BiSolidXSquare
                            onClick={async () => {
                                setSubmitting(true);

                                await fetch(
                                    `/api/current/${data.id}/blacklist?blacklisted=false`,
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
                <Tooltip key={data.id + "-black"} content="Kara Listede Değil">
                    <span className="text-2xl text-green-600 active:opacity-50 cursor-pointer">
                        <BiCheckSquare
                            onClick={async () => {
                                setSubmitting(true);

                                await fetch(
                                    `/api/current/${data.id}/blacklist?blacklisted=true`,
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
