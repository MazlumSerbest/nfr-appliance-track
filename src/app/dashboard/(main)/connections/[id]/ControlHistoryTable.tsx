"use client";
import { useCallback } from "react";

import { SortDescriptor } from "@heroui/table";

import DataTable from "@/components/DataTable";

import { DateTimeFormat } from "@/utils/date";

type Props = {
    controlHistory: ControlHistory[];
};

export default function ControlHistoryTable({ controlHistory }: Props) {
    //#region Table
    const initialVisibleColumns = ["user", "createdAt"];

    const sort: SortDescriptor = {
        column: "createdAt",
        direction: "descending",
    };

    const columns: Column[] = [
        {
            key: "user",
            name: "Kullanıcı",
        },
        {
            key: "createdAt",
            name: "Gözetim Tarihi",
            sortable: true,
        },
    ];

    const renderCell = useCallback(
        (connection: Connection, columnKey: React.Key) => {
            const cellValue: any =
                connection[columnKey as keyof typeof connection];

            switch (columnKey) {
                case "user":
                    return <p>{cellValue?.name ? cellValue.name : "-"}</p>;
                case "createdAt":
                    return <p>{DateTimeFormat(cellValue)}</p>;
                default:
                    return cellValue ? cellValue : "-";
            }
        },
        [],
    );
    //#endregion

    return (
        <DataTable
            storageKey="controlHistory"
            basic
            compact
            striped
            className="mt-4 mb-2"
            emptyContent="Herhangi bir gözetim bulunamadı!"
            data={controlHistory || []}
            columns={columns}
            renderCell={renderCell}
            sortOption={sort}
            initialVisibleColumNames={initialVisibleColumns}
        />
    );
}
