import React, { Key, ReactNode, useEffect } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Selection,
    SortDescriptor,
} from "@nextui-org/table";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@nextui-org/dropdown";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Pagination } from "@nextui-org/pagination";
import { BiPlus, BiSearch, BiChevronDown } from "react-icons/bi";
import Loader from "./loaders/Loader";

type Props = {
    columns: Column[];
    data: any;
    emptyContent?: ReactNode;
    isCompact: boolean;
    isStriped: boolean;
    className?: string;
    activeOptions?: ActiveOption[];
    renderCell: (item: any, columnKey: Key) => ReactNode;
    sortOption: SortDescriptor;
    storageKey?: string;
    searchValue?: string;
    defaultRowsPerPage?: 10 | 20 | 50;
    initialVisibleColumNames: string[];
    onDoubleClick?: (item: any) => any;
    onAddNew?: () => void;
};

export default function DataTable(props: Props) {
    const {
        columns,
        data,
        emptyContent,
        isCompact,
        isStriped,
        className,
        activeOptions,
        renderCell,
        sortOption,
        storageKey = "",
        searchValue = "",
        defaultRowsPerPage,
        initialVisibleColumNames,
        onDoubleClick,
        onAddNew,
    } = props;

    type DataType = (typeof data)[0];
    const [filterValue, setFilterValue] = React.useState(searchValue);
    // const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    //     new Set([]),
    // );
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
        new Set(initialVisibleColumNames),
    );
    const [activeFilter, setActiveFilter] = React.useState<Selection>("all");
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(defaultRowsPerPage || 10);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: sortOption.column,
        direction: sortOption.direction,
    });
    const [page, setPage] = React.useState(1);

    // const pages = Math.ceil(data.length / rowsPerPage);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) =>
            Array.from(visibleColumns).includes(column.key),
        );
    }, [columns, visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredItems = [...data];

        if (hasSearchFilter) {
            filteredItems = filteredItems.filter((fitem) => {
                const filterColumns = columns.filter((e) => e.searchable);

                return filterColumns.some((e) =>
                    fitem[e.key]
                        ?.toString()
                        ?.toLowerCase()
                        .includes(filterValue.toLowerCase()),
                );
            });
        }
        if (
            activeFilter !== "all" &&
            Array.from(activeFilter).length !== activeOptions?.length
        ) {
            filteredItems = filteredItems.filter((item) =>
                Array.from(activeFilter).includes(
                    item.active ? "true" : "false",
                ),
            );
        }

        return filteredItems;
    }, [
        hasSearchFilter,
        activeOptions?.length,
        data,
        filterValue,
        activeFilter,
        columns,
    ]);

    // const items = React.useMemo(() => {
    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const sortedItems = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        //     return filteredItems.slice(start, end);
        // }, [page, filteredItems, rowsPerPage]);

        // const sortedItems = React.useMemo(() => {
        //     return [...items].sort((a: DataType, b: DataType) => {
        return [...filteredItems]
            .sort((a: DataType, b: DataType) => {
                const first = a[
                    sortDescriptor.column as keyof DataType
                ] as number;
                const second = b[
                    sortDescriptor.column as keyof DataType
                ] as number;
                const cmp = first < second ? -1 : first > second ? 1 : 0;

                return sortDescriptor.direction === "descending" ? -cmp : cmp;
                // });
                // }, [sortDescriptor, items]);
            })
            .slice(start, end);
    }, [sortDescriptor, page, filteredItems, rowsPerPage]);

    const onRowsPerPageChange = React.useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);

            window.localStorage.setItem(
                `${storageKey}RowsPerPage`,
                JSON.stringify(Number(e.target.value)),
            );
        },
        [storageKey],
    );

    const onSearchChange = React.useCallback(
        (value?: string) => {
            if (value) {
                setFilterValue(value);
                setPage(1);
            } else {
                setFilterValue("");
            }

            window.localStorage.setItem(
                `${storageKey}SearchValue`,
                JSON.stringify(value),
            );
        },
        [storageKey],
    );

    //#region Top Content
    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        classNames={{
                            base: "w-full sm:max-w-[44%]",
                            inputWrapper:
                                "border-0 ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500",
                            clearButton: "text-xl text-zinc-500",
                            input: "placeholder:italic placeholder:text-zinc-400",
                        }}
                        placeholder="Arama Yap..."
                        size="sm"
                        startContent={
                            <BiSearch className="text-2xl text-zinc-300" />
                        }
                        value={filterValue}
                        variant="bordered"
                        onClear={() => setFilterValue("")}
                        onValueChange={(v) => {
                            onSearchChange(v);
                            window.localStorage.setItem(
                                `${storageKey}SearchValue`,
                                JSON.stringify(v),
                            );
                        }}
                    />
                    <div className="flex gap-3">
                        {activeOptions?.length ? (
                            <Dropdown>
                                <DropdownTrigger className="hidden sm:flex">
                                    <Button
                                        endContent={
                                            <BiChevronDown className="text-sm" />
                                        }
                                        size="sm"
                                        variant="flat"
                                    >
                                        Aktif
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Table Columns"
                                    closeOnSelect={false}
                                    selectedKeys={activeFilter}
                                    selectionMode="multiple"
                                    onSelectionChange={setActiveFilter}
                                >
                                    {(activeOptions || []).map((active) => (
                                        <DropdownItem
                                            key={active.key}
                                            className="capitalize"
                                        >
                                            {active.name}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        ) : (
                            <></>
                        )}
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={
                                        <BiChevronDown className="text-sm" />
                                    }
                                    size="sm"
                                    variant="flat"
                                >
                                    Kolonlar
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={(keys) => {
                                    setVisibleColumns(keys);

                                    window.localStorage.setItem(
                                        `${storageKey}VisibleColumns`,
                                        JSON.stringify(
                                            Array.from(keys).map((key) => key),
                                        ),
                                    );
                                }}
                            >
                                {columns.map((column) => (
                                    <DropdownItem
                                        key={column.key}
                                        className="capitalize"
                                    >
                                        {column.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        {onAddNew ? (
                            <Button
                                color="primary"
                                className="bg-sky-500"
                                endContent={<BiPlus />}
                                size="sm"
                                onPress={onAddNew}
                            >
                                Ekle
                            </Button>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-zinc-400 text-sm">
                        Toplam satır: {data.length}
                    </span>
                    <label className="flex items-center text-zinc-400 text-sm">
                        Sayfa satır sayısı:
                        <select
                            className="bg-transparent outline-none text-zinc-400 text-sm ml-2"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="10" selected={rowsPerPage == 10}>
                                10
                            </option>
                            <option value="20" selected={rowsPerPage == 20}>
                                20
                            </option>
                            <option value="50" selected={rowsPerPage == 50}>
                                50
                            </option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        activeOptions,
        activeFilter,
        visibleColumns,
        columns,
        onAddNew,
        data.length,
        onRowsPerPageChange,
        rowsPerPage,
        onSearchChange,
        storageKey,
    ]);
    //#endregion

    //#region Bottom Content
    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-center items-center">
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    classNames={{
                        cursor: "bg-sky-500 text-white",
                    }}
                    color="default"
                    // isDisabled={hasSearchFilter}
                    page={page}
                    total={pages}
                    onChange={(p) => {
                        setPage(p);
                        window.localStorage.setItem(
                            `${storageKey}CurrentPage`,
                            JSON.stringify(p),
                        );
                    }}
                />
                {/* <span className="text-sm text-zinc-400">
                    {selectedKeys === "all"
                        ? "All items selected"
                        : `${selectedKeys.size} of ${items.length} selected`}
                </span> */}
            </div>
        );
    }, [page, pages, storageKey]);
    //#endregion

    useEffect(() => {
        if (storageKey) {
            let searchValue = window.localStorage.getItem(
                `${storageKey}SearchValue`,
            );
            let currentPage = window.localStorage.getItem(
                `${storageKey}CurrentPage`,
            );
            let visibleColumns = window.localStorage.getItem(
                `${storageKey}VisibleColumns`,
            );
            let rowsPerPage = window.localStorage.getItem(
                `${storageKey}RowsPerPage`,
            );

            searchValue ? setFilterValue(JSON.parse(searchValue)) : null;
            currentPage ? setPage(parseInt(currentPage)) : null;
            visibleColumns
                ? setVisibleColumns(JSON.parse(visibleColumns))
                : null;
            rowsPerPage ? setRowsPerPage(parseInt(rowsPerPage)) : null;
        }
    }, [storageKey]);

    return (
        <Table
            isCompact={isCompact}
            isStriped={isStriped}
            aria-label="Table component with custom cells, pagination and sorting"
            className={className ?? ""}
            classNames={{
                tr: "hover:!bg-sky-300",
                td: [
                    "data-[selected=true]:before:!bg-sky-200",
                    // changing the rows border radius
                    // first
                    "group-data-[first=true]:first:before:rounded-none",
                    "group-data-[first=true]:last:before:rounded-none",
                    // middle
                    "group-data-[middle=true]:before:rounded-none",
                    // last
                    "group-data-[last=true]:first:before:rounded-none",
                    "group-data-[last=true]:last:before:rounded-none",
                ],
                // tr: "hover:bg-blue-300 data-[selected=true]:bg-sky-300 rounded-lg",
                // td: "data-[selected=true]:bg-transparent",
            }}
            topContent={topContent}
            topContentPlacement="outside"
            bottomContent={data.length > rowsPerPage ? bottomContent : <></>}
            bottomContentPlacement="outside"
            // checkboxesProps={{
            //     classNames: {
            //         wrapper:
            //             "after:bg-foreground after:text-background text-background",
            //     },
            // }}
            selectionMode="single"
            // selectedKeys={selectedKeys}
            // onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
            sortDescriptor={sortDescriptor}
        >
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.key}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                emptyContent={emptyContent}
                items={sortedItems}
                loadingContent={<Loader />}
            >
                {(item) => (
                    <TableRow
                        key={item.id}
                        className={onDoubleClick ? "cursor-pointer" : ""}
                        onDoubleClick={() =>
                            onDoubleClick ? onDoubleClick(item) : undefined
                        }
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
