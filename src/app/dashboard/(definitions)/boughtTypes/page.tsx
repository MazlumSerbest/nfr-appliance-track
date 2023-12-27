"use client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import toast from "react-hot-toast";

import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/modal";
import { SortDescriptor } from "@nextui-org/table";
import { Tooltip } from "@nextui-org/tooltip";
import { Button } from "@nextui-org/button";

import Skeleton, { TableSkeleton } from "@/components/loaders/Skeleton";
import DataTable from "@/components/DataTable";
import BoolChip from "@/components/BoolChip";
import { BiEdit, BiTrash } from "react-icons/bi";
import { DateTimeFormat } from "@/utils/date";
import useUserStore from "@/store/user";
import { activeOptions } from "@/lib/constants";
import AutoComplete from "@/components/AutoComplete";

export default function BoughtTypes() {
    const { data, error, mutate } = useSWR("/api/boughtType");

    if (error) return <div>Yükleme Hatası!</div>;
    if (!data)
        return (
            <div className="flex flex-col mt-4">
                <Skeleton>
                    <TableSkeleton />
                </Skeleton>
            </div>
        );
    return (
        <>
            <DataTable
                isCompact
                isStriped
                className="mt-4 mb-2"
                emptyContent="Herhangi bir alım tipi bulunamadı!"
                data={data || []}
                columns={columns}
                renderCell={renderCell}
                sortOption={sort}
                initialVisibleColumNames={visibleColumns}
                activeOptions={activeOptions}
                onAddNew={() => {
                    setIsNew(true);
                    reset({});
                    reset({});
                    onOpen();
                }}
            />
        </>
    );
}
