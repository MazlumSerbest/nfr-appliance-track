"use client";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/table";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    useDisclosure,
} from "@heroui/modal";

import Skeleton, { DefaultSkeleton } from "@/components/loaders/Skeleton";
import AutoComplete from "@/components/AutoComplete";
import RegInfo from "@/components/buttons/RegInfo";
import DeleteButton from "@/components/buttons/DeleteButton";
import { BiPlus, BiX } from "react-icons/bi";
import useUserStore from "@/store/user";
import {
    getCustomers,
    getDealers,
    getSuppliers,
    getProducts,
    getLicenseTypes,
} from "@/lib/data";
import { orderStatus } from "@/lib/constants";

interface IFormInput {
    status: string;
    registerNo: string;
    invoiceNo?: string;
    expiry?: string;
    address?: string;
    note?: string;
    customerId: number;
    dealerId?: number;
    subDealerId: number;
    supplierId: number;
    productId?: number;
    licenseTypeId?: number;
    updatedBy: string;
    customer?: Current;
    dealer?: Current;
    subDealer?: Current;
    supplier?: Current;
    product?: Product;
    licenseType?: LicenseType;
    items?: OrderItem[];
}

export default function OrderDetail({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { user: currUser } = useUserStore();

    const [submitting, setSubmitting] = useState(false);
    const [submittingItem, setSubmittingItem] = useState(false);
    const [itemIsNew, setItemIsNew] = useState(false);
    const {
        isOpen: isOpenItem,
        onClose: onCloseItem,
        onOpen: onOpenItem,
        onOpenChange: onOpenChangeItem,
    } = useDisclosure();

    const [customers, setCustomers] = useState<ListBoxItem[] | null>(null);
    const [dealers, setDealers] = useState<ListBoxItem[] | null>(null);
    const [suppliers, setSuppliers] = useState<ListBoxItem[] | null>(null);
    const [products, setProducts] = useState<ListBoxItem[] | null>(null);
    const [licenseTypes, setLicenseTypes] = useState<ListBoxItem[] | null>(
        null,
    );

    const { data, error, mutate } = useSWR(`/api/order/${params.id}`, null, {
        revalidateOnFocus: false,
        onSuccess: (pro) => {
            reset(pro);
            setValue("expiry", pro.expiry?.split("T")[0]);
        },
    });

    //#region Form
    const { register, reset, setValue, handleSubmit, control } =
        useForm<IFormInput>();

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setSubmitting(true);
        data.updatedBy = currUser?.username ?? "";
        delete data["customer"];
        delete data["dealer"];
        delete data["subDealer"];
        delete data["supplier"];
        delete data["product"];
        delete data["licenseType"];
        delete data["items"];

        await fetch(`/api/order/${params.id}`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        }).then(async (res) => {
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
    };
    //#endregion

    //#region Table
    const columns = [
        { name: "Ad", key: "name" },
        { name: "Tip", key: "type" },
        { name: "Adet", key: "quantity" },
        { name: "Fiyat", key: "price" },
        { name: "Not", key: "note" },
        { name: "", key: "actions" },
    ];

    const renderCell = useCallback((item: OrderItem, columnKey: React.Key) => {
        const cellValue = item[columnKey as keyof OrderItem];

        switch (columnKey) {
            case "name":
                return <></>;
            case "type":
                return <></>;
            case "quantity":
                return <></>;
            case "price":
                return <></>;
            case "note":
                return <></>;
            case "actions":
                return <></>;
            default:
                return cellValue;
        }
    }, []);
    //#endregion

    //#region Data
    async function getData() {
        const cus: ListBoxItem[] = await getCustomers(true);
        setCustomers(cus);
        const dea: ListBoxItem[] = await getDealers(true);
        setDealers(dea);
        const sup: ListBoxItem[] = await getSuppliers(true);
        setSuppliers(sup);
        const pro: ListBoxItem[] = await getProducts(true);
        setProducts(pro);
        const lic: ListBoxItem[] = await getLicenseTypes(true);
        setLicenseTypes(lic);
    }

    useEffect(() => {
        getData();
    }, []);
    //#endregion

    if (error) return <div>Yükleme Hatası!</div>;
    if (
        !data ||
        !customers ||
        !dealers ||
        !suppliers ||
        !products ||
        !licenseTypes
    )
        return (
            <div className="flex flex-col mt-4">
                <Skeleton>
                    <DefaultSkeleton />
                </Skeleton>
            </div>
        );
    return (
        <div className="flex flex-col gap-2">
            <Card className="mt-4 px-1 py-2">
                <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                    <CardBody className="gap-3">
                        <div className="flex items-center pb-2 pl-1">
                            <p className="text-3xl font-bold text-sky-500">
                                {data.registerNo}
                            </p>
                            <div className="flex-1"></div>
                            <BiX
                                className="text-3xl text-zinc-500 cursor-pointer active:opacity-50"
                                onClick={() => router.back()}
                            />
                        </div>
                        <div className="divide-y divide-zinc-200">
                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label htmlFor="status" className="font-medium">
                                    Durum
                                </label>
                                <div className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full h-10 rounded-md border-0 px-3 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2">
                                    <select
                                        id="status"
                                        className="w-full border-none text-sm text-zinc-700 outline-none"
                                        {...register("status")}
                                    >
                                        {orderStatus?.map((os) => (
                                            <option key={os.key} value={os.key}>
                                                {os.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="registerNo"
                                    className="font-medium after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Kayıt No
                                </label>
                                <input
                                    type="text"
                                    id="registerNo"
                                    required
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("registerNo", {
                                        required: true,
                                        maxLength: 50,
                                    })}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="invoiceNo"
                                    className="font-medium"
                                >
                                    Fatura No
                                </label>
                                <input
                                    type="text"
                                    id="invoiceNo"
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("invoiceNo", {
                                        maxLength: 50,
                                    })}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label htmlFor="expiry" className="font-medium">
                                    Vade
                                </label>
                                <input
                                    type="date"
                                    id="expiry"
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("expiry")}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="customerId"
                                    className="font-medium"
                                >
                                    Müşteri
                                </label>
                                <Controller
                                    control={control}
                                    name="customerId"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <AutoComplete
                                            onChange={onChange}
                                            value={value}
                                            data={customers || []}
                                            className="md:col-span-2 xl:col-span-1 my-1 sm:my-0"
                                        />
                                    )}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="dealerId"
                                    className="font-medium"
                                >
                                    Bayi
                                </label>
                                <Controller
                                    control={control}
                                    name="dealerId"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <AutoComplete
                                            onChange={onChange}
                                            value={value}
                                            data={dealers || []}
                                            className="md:col-span-2 xl:col-span-1 my-1 sm:my-0"
                                        />
                                    )}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="subDealerId"
                                    className="font-medium"
                                >
                                    Alt Bayi
                                </label>
                                <Controller
                                    control={control}
                                    name="subDealerId"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <AutoComplete
                                            onChange={onChange}
                                            value={value}
                                            data={dealers || []}
                                            className="md:col-span-2 xl:col-span-1 my-1 sm:my-0"
                                        />
                                    )}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="supplierId"
                                    className="font-medium"
                                >
                                    Tedarikçi
                                </label>
                                <Controller
                                    control={control}
                                    name="supplierId"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <AutoComplete
                                            onChange={onChange}
                                            value={value}
                                            data={suppliers || []}
                                            className="md:col-span-2 xl:col-span-1 my-1 sm:my-0"
                                        />
                                    )}
                                />
                            </div>
                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="address"
                                    className="font-medium"
                                >
                                    Sevk Adresi
                                </label>
                                <textarea
                                    id="address"
                                    rows={4}
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("address", {
                                        maxLength: 500,
                                    })}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label htmlFor="note" className="font-medium">
                                    Not
                                </label>
                                <textarea
                                    id="note"
                                    rows={4}
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("note", {
                                        maxLength: 500,
                                    })}
                                />
                            </div>
                        </div>
                    </CardBody>

                    {currUser?.role === "technical" ? undefined : (
                        <CardFooter className="flex gap-2">
                            <div className="flex-1"></div>
                            <RegInfo
                                data={data}
                                isButton
                                trigger={
                                    <Button
                                        color="primary"
                                        className="bg-sky-500"
                                    >
                                        Kayıt Bilgisi
                                    </Button>
                                }
                            />

                            <DeleteButton
                                table="projects"
                                data={data}
                                mutate={mutate}
                                isButton={true}
                                router={router}
                                trigger={
                                    <Button
                                        color="primary"
                                        className="bg-red-500"
                                    >
                                        Sil
                                    </Button>
                                }
                            />

                            <Button
                                type="submit"
                                color="primary"
                                className="text-white bg-green-600"
                                isLoading={submitting}
                            >
                                Kaydet
                            </Button>
                        </CardFooter>
                    )}
                </form>
            </Card>

            <Card className="px-1 py-2">
                <CardBody className="gap-3">
                    <div className="flex items-center pb-2 pl-1">
                        <p className="text-2xl font-bold text-sky-500">
                            Kalemler
                        </p>
                        <div className="flex-1"></div>
                        <Button
                            color="primary"
                            className="bg-sky-500"
                            endContent={<BiPlus />}
                            size="sm"
                            onPress={() => {
                                setItemIsNew(true);
                                // resetHistory({});
                                // resetHistory({});
                                onOpenItem();
                            }}
                        >
                            Satır Ekle
                        </Button>
                    </div>

                    <Table
                        aria-label="Example table with custom cells"
                        removeWrapper
                    >
                        <TableHeader columns={columns}>
                            {(column) => (
                                <TableColumn
                                    key={column.key}
                                    align={
                                        column.key === "actions"
                                            ? "center"
                                            : "start"
                                    }
                                >
                                    {column.name}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody items={data.items}>
                            {(item: OrderItem) => (
                                <TableRow key={item.id}>
                                    {(columnKey) => (
                                        <TableCell>
                                            {renderCell(item, columnKey)}
                                        </TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            <Modal
                isOpen={isOpenItem}
                onOpenChange={onOpenChangeItem}
                size="lg"
                placement="center"
                backdrop="opaque"
                shadow="lg"
                isDismissable={false}
                scrollBehavior="outside"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-zinc-500">
                        {itemIsNew ? "Yeni Satır" : "Satır Güncelleme"}
                    </ModalHeader>
                    <ModalBody>
                        <form
                            autoComplete="off"
                            className="flex flex-col gap-2"
                            // onSubmit={
                            //     historyIsNew
                            //         ? handleHistorySubmit(onSubmitHistory)
                            //         : handleHistorySubmit(onSubmitHistoryUpdate)
                            // }
                        >
                            <div className="flex flex-row gap-2 mt-4">
                                <div className="flex-1"></div>
                                <Button
                                    variant="bordered"
                                    onPress={onCloseItem}
                                >
                                    Kapat
                                </Button>
                                <Button
                                    type="submit"
                                    color="success"
                                    className="text-white bg-green-600"
                                    isLoading={submittingItem}
                                >
                                    Kaydet
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
}
