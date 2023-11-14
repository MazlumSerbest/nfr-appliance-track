"use client";
import React from "react";
import { useRouter } from "next/navigation";
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
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/modal";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Pagination } from "@nextui-org/pagination";
import { Tooltip } from "@nextui-org/tooltip";
import {
    BiSearch,
    BiEdit,
    BiTrash,
    BiPlus,
    BiLinkExternal,
} from "react-icons/bi";
import BoolChip from "@/components/BoolChip";
import { faker } from "@faker-js/faker";

export default function Connections() {
    const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
    const router = useRouter();

    const data = [
        {
            id: faker.string.uuid(),
            ip: "1.1.1.1",
            login: faker.internet.userName(),
            password: "12368172",
            active: true,
            note: faker.lorem.paragraph(4),
        },
        {
            id: faker.string.uuid(),
            ip: "1.10.10.1",
            login: faker.internet.userName(),
            password: "12314",
            active: false,
            note: faker.lorem.paragraph(1),
        },
    ];

    const columns = [
        {
            key: "ip",
            label: "IP",
            width: 150,
        },
        {
            key: "login",
            label: "Kullanıcı",
            width: 150,
        },
        // {
        //     key: "password",
        //     label: "Şifre",
        //     width: 150,
        // },
        {
            key: "active",
            label: "Aktif",
            width: 80,
        },
        {
            key: "note",
            label: "Not",
            // width: 80,
        },
        {
            key: "actions",
            label: "Aksiyonlar",
            width: 100,
        },
    ];

    const renderCell = React.useCallback(
        (connection: Connection, columnKey: React.Key) => {
            const cellValue: any =
                connection[columnKey as keyof typeof connection];

            switch (columnKey) {
                case "ip":
                    return (
                        <a
                            href={"http://" + cellValue}
                            target="_blank"
                            className="underline text-sky-400"
                        >
                            {cellValue}
                        </a>
                    );
                case "active":
                    return <BoolChip value={cellValue} />;
                case "note":
                    return (
                        <h6>
                            {cellValue.length > 40
                                ? cellValue.substring(0, 40) + "..."
                                : cellValue}
                        </h6>
                    );
                case "actions":
                    return (
                        <div className="relative flex justify-start items-center gap-2">
                            <Tooltip key={connection.id} content="Detay">
                                <span className="text-xl text-green-600 active:opacity-50">
                                    <BiLinkExternal
                                        onClick={() =>
                                            router.push(
                                                "connections/" + connection.id,
                                            )
                                        }
                                    />
                                </span>
                            </Tooltip>
                            <Tooltip key={connection.id} content="Sil">
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
                onPress={onOpen}
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
        <>
            <Table
                isStriped
                fullWidth
                selectionMode="single"
                color="primary"
                topContent={topContent}
                topContentPlacement="outside"
                // bottomContent={bottomContent}
                aria-label="Connections table"
                className="mt-4 mb-2"
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
                    emptyContent={<>Herhangi bir bağlantı bulunamadı!</>}
                    loadingContent={<Loader />}
                >
                    {(item: Connection) => (
                        <TableRow
                            key={item.id}
                            className="cursor-pointer"
                            onDoubleClick={() => {
                                router.push("connections/" + item.id);
                            }}
                        >
                            {(columnKey) => (
                                <TableCell>
                                    {renderCell(item, columnKey)}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
                backdrop="opaque"
                shadow="lg"
                isDismissable={false}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-zinc-600">
                        Yeni Bağlantı
                    </ModalHeader>
                    <ModalBody>
                        <form
                            action=""
                            autoComplete="off"
                            className="flex flex-col gap-3"
                        >
                            <div>
                                <label
                                    htmlFor="ip"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    IP <span className="text-red-400">*</span>
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:max-w-md">
                                        <span className="flex select-none items-center pl-3 text-zinc-400 sm:text-sm">
                                            http://
                                        </span>
                                        <input
                                            type="text"
                                            name="ip"
                                            id="ip"
                                            autoComplete="ip"
                                            required
                                            // placeholder="1.1.1.1"
                                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-zinc-700 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="login"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Kullanıcı{" "}
                                    <span className="text-red-400">*</span>
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="login"
                                        id="login"
                                        required
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Şifre{" "}
                                    <span className="text-red-400">*</span>
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        autoComplete="off"
                                        required
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="note"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Not
                                </label>
                                <div className="mt-2">
                                    <textarea
                                        name="note"
                                        id="note"
                                        rows={3}
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row gap-2 mt-4">
                                <div className="flex-1"></div>
                                <Button
                                    color="danger"
                                    onPress={onClose}
                                    className="bg-red-500"
                                >
                                    Kapat
                                </Button>
                                <Button
                                    type="submit"
                                    color="success"
                                    className="text-white bg-green-600"
                                >
                                    Kaydet
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
