import React from "react";
import useSWR from "swr";
import Loader from "@/components/loaders/Loader";
import Skeleton, { TableSkeleton } from "@/components/loaders/Skeleton";
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
} from "@nextui-org/table";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Pagination } from "@nextui-org/pagination";
import { Tooltip } from "@nextui-org/tooltip";
import { BiSearch, BiEdit, BiTrash, BiPlus } from "react-icons/bi";
import BoolChip from "@/components/BoolChip";
import { faker } from "@faker-js/faker";

export default function ProductsTab() {
    const data = [
        {
            id: faker.string.uuid(),
            name: "Distributed Edge",
            modelNo: "2100",
            brand: "Sophos",
            type: "Firewall",
            active: true
        },
        {
            id: faker.string.uuid(),
            name: "SMB",
            modelNo: "2300",
            brand: "Fortinet",
            type: "Firewall",
            active: false
        },
    ];

    const columns = [
        {
            key: "name",
            label: "Ürün Adı",
            width: 200,
        },
        {
            key: "modelNo",
            label: "Model No",
            width: 150,
        },
        {
            key: "brand",
            label: "Marka",
            width: 150,
        },
        {
            key: "type",
            label: "Tip",
            width: 100,
        },
        {
            key: "active",
            label: "Aktif",
            width: 80,
        },
        {
            key: "actions",
            label: "Aksiyonlar",
            width: 100,
        },
    ];

    const renderCell = React.useCallback(
        (product: Product, columnKey: React.Key) => {
            const cellValue: any =
                product[columnKey as keyof typeof product];

            switch (columnKey) {
                case "name":
                    return (
                        <h6 className="text-clip">
                            {cellValue.length > 30
                                ? cellValue.substring(0, 30) + "..."
                                : cellValue}
                        </h6>
                    );
                case "active":
                    return <BoolChip value={cellValue} />;
                case "actions":
                    return (
                        <div className="relative flex justify-start items-center gap-2">
                            <Tooltip
                                key={product.id}
                                content="Ürünü Düzenle"
                            >
                                <span className="text-xl text-green-600 active:opacity-50">
                                    <BiEdit
                                        onClick={() => {}}
                                        onDoubleClick={() => {}}
                                    />
                                </span>
                            </Tooltip>
                            <Tooltip key={product.id} content="Ürünü Sil">
                                <span className="text-xl text-red-500 active:opacity-50">
                                    <BiTrash onClick={() => {}} />
                                </span>
                            </Tooltip>
                        </div>
                    );
                default:
                    return cellValue;
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const topContent = (
        <div className="flex justify-between">
            <Input
                isClearable
                className="w-full sm:max-w-[44%]"
                placeholder="Arama Yap"
                startContent={<BiSearch className="text-2xl text-zinc-500" />}
                value=""
            />
            <Button
                color="primary"
                // onPress={onOpen}
                endContent={<BiPlus className="text-xl text-white" />}
                className="ml-2 min-w-fit bg-sky-500"
            />
        </div>
    );

    // const fetcher = (url: string) => fetch(url).then((res) => res.json());
    // const { data, error } = useSWR(
    //     "/api/acronis/tenant/users/28a5db46-58eb-4a61-b064-122f07ddac6a",
    //     fetcher,
    // );

    // if (error) return <div>failed to load</div>;
    // if (!data)
    //     return (
    //         <Skeleton>
    //             <TableSkeleton />
    //         </Skeleton>
    //     );

    return (
        <Table
            isStriped
            fullWidth
            selectionMode="single"
            color="primary"
            topContent={topContent}
            topContentPlacement="outside"
            // bottomContent={bottomContent}
            aria-label="Products table"
        >
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn
                        key={column.key}
                        width={column.width ? column.width : null}
                        // align={
                        //     column.align &&
                        //     (column.align === "center" ||
                        //         column.align === "start" ||
                        //         column.align === "end")
                        //         ? column.align
                        //         : "start"
                        // }
                    >
                        {column.label}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                items={data || []}
                emptyContent={<>Herhangi bir ürün bulunamadı!</>}
                loadingContent={<Loader />}
            >
                {(item: Product) => (
                    <TableRow
                        key={item.id}
                        className="cursor-pointer"
                        onDoubleClick={() => {}}
                    >
                        {(columnKey) => (
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
