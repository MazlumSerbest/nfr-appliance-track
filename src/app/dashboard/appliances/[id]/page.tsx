"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

import { Card, CardBody, CardFooter } from "@nextui-org/card";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
} from "@nextui-org/modal";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";

import Skeleton, { DefaultSkeleton } from "@/components/loaders/Skeleton";
import RegInfo from "@/components/buttons/RegInfo";
import DeleteButton from "@/components/buttons/DeleteButton";
import AutoComplete from "@/components/AutoComplete";
import {
    BiX,
    BiCheckShield,
    BiChevronLeft,
    BiChevronRight,
} from "react-icons/bi";
import useUserStore from "@/store/user";
import { DateFormat } from "@/utils/date";
import {
    getProducts,
    getCustomers,
    getDealers,
    getSuppliers,
} from "@/lib/data";

interface IFormInput {
    id: number;
    productId: number;
    serialNo: string;
    boughtAt: string;
    soldAt: string;
    note?: string;
    customerId: number;
    dealerId: number;
    subDealerId: number;
    supplierId: number;
    updatedBy: string;
    product?: Product;
    licenses?: License[];
    customer?: Current;
    dealer?: Current;
    subDealer?: Current;
    supplier?: Current;
}

export default function ApplianceDetail({
    params,
}: {
    params: { id: string };
}) {
    const router = useRouter();
    const { user: currUser } = useUserStore();
    const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
    const [products, setProducts] = useState<ListBoxItem[] | null>(null);
    const [customers, setCustomers] = useState<ListBoxItem[] | null>(null);
    const [dealers, setDealers] = useState<ListBoxItem[] | null>(null);
    const [suppliers, setSuppliers] = useState<ListBoxItem[] | null>(null);

    //#region Form
    const { register, reset, handleSubmit, control } = useForm<IFormInput>({});
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        data.updatedBy = currUser?.username ?? "";

        delete data["product"];
        delete data["licenses"];
        delete data["customer"];
        delete data["dealer"];
        delete data["subDealer"];
        delete data["supplier"];

        await fetch(`/api/appliance/${data.id}`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        }).then(async (res) => {
            const result = await res.json();
            if (result.ok) {
                toast.success(result.message);
                onClose();
                reset();
                mutate();
            } else {
                toast.error(result.message);
            }
            return result;
        });
    };
    //#endregion

    //#region Data
    async function getData() {
        const pro: ListBoxItem[] = await getProducts(true);
        setProducts(pro);
        const cus: ListBoxItem[] = await getCustomers(true);
        setCustomers(cus);
        const deal: ListBoxItem[] = await getDealers(true);
        setDealers(deal);
        const sup: ListBoxItem[] = await getSuppliers(true);
        setSuppliers(sup);
    }

    useEffect(() => {
        getData();
    }, []);
    //#endregion

    const { data, error, mutate } = useSWR(
        `/api/appliance/${params.id}`,
        null,
        {
            onSuccess: (app) => {
                reset(app);
            },
        },
    );

    if (error) return <div>Yükleme Hatası!</div>;
    if (!data)
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
                <CardBody className="gap-3">
                    <div className="flex items-center pb-2 pl-1">
                        <p className="text-3xl font-bold text-sky-500">
                            {data.serialNo}
                        </p>
                        <div className="flex-1"></div>
                        <BiX
                            className="text-3xl text-zinc-500 cursor-pointer active:opacity-50"
                            onClick={() => router.back()}
                        />
                    </div>
                    <div className="divide-y divide-zinc-200">
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Ürün</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {(data.product?.brand?.name
                                    ? data.product?.brand?.name + " "
                                    : "") + data.product?.model || "-"}
                            </dd>
                        </div>
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Durum</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {(!data.customerId
                                    ? "Stok"
                                    : !data.soldAt
                                    ? "Sipariş"
                                    : "Aktif") || "-"}
                            </dd>
                        </div>

                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Alım Tarihi</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {DateFormat(data.boughtAt) || "-"}
                            </dd>
                        </div>
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Satış Tarihi</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {DateFormat(data.soldAt) || "-"}
                            </dd>
                        </div>

                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Müşteri</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {data.customer?.name || "-"}
                            </dd>
                        </div>
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Bayi</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {data.dealer?.name || "-"}
                            </dd>
                        </div>
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Alt Bayi</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {data.subDealer?.name || "-"}
                            </dd>
                        </div>
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Tedarikçi</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {data.supplier?.name || "-"}
                            </dd>
                        </div>
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Not</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {data.note || "-"}
                            </dd>
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="flex gap-2">
                    <div className="flex-1"></div>
                    <RegInfo
                        data={data}
                        isButton
                        trigger={
                            <Button color="primary" className="bg-green-600">
                                Kayıt Bilgisi
                            </Button>
                        }
                    />

                    <DeleteButton
                        table="appliances"
                        data={data}
                        mutate={mutate}
                        isButton={true}
                        router={router}
                        trigger={
                            <Button color="primary" className="bg-red-500">
                                Sil
                            </Button>
                        }
                    />

                    <Button
                        color="primary"
                        className="bg-sky-500"
                        onPress={onOpen}
                    >
                        Düzenle
                    </Button>
                </CardFooter>
            </Card>

            <Accordion
                selectionMode="multiple"
                variant="splitted"
                defaultExpandedKeys={data.licenses.length ? ["licenses"] : []}
                className="p-0"
                itemClasses={{
                    title: "font-medium text-zinc-600",
                    base: "px-1 py-2",
                }}
            >
                <AccordionItem
                    key="licenses"
                    aria-label="Licenses"
                    title="Lisans Bilgileri"
                    subtitle="Bu cihaza tanımlanmış lisans bilgileri"
                    indicator={
                        <BiChevronLeft className="text-3xl text-zinc-500" />
                    }
                    startContent={
                        <BiCheckShield className="text-4xl text-green-600/60" />
                    }
                >
                    {data.licenses.length > 0 ? (
                        <>
                            <ul
                                role="list"
                                className="divide-y divide-zinc-200"
                            >
                                <li></li>
                                {data?.licenses.map((lic: License) => (
                                    <li
                                        onClick={() =>
                                            router.push(
                                                `/dashboard/licenses/${lic?.id}`,
                                            )
                                        }
                                        key={lic.id}
                                        className="flex justify-between py-2 items-center cursor-pointer"
                                    >
                                        <div className="flex flex-1 gap-x-4">
                                            <div className="min-w-0 flex-auto">
                                                <p className="text-sm font-semibold leading-6 text-zinc-600">
                                                    {lic.licenseType?.type}
                                                    {lic.licenseType
                                                        ?.duration ? (
                                                        <span className="inline-flex items-center rounded-md bg-sky-50 px-2 py-1 text-xs font-medium text-sky-600 ring-1 ring-inset ring-sky-600/20 ml-2">
                                                            {lic.licenseType
                                                                ?.duration +
                                                                " ay"}
                                                        </span>
                                                    ) : (
                                                        <> </>
                                                    )}
                                                    {/* {lic.customerId ? (
                                                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-600/20 ml-2">
                                                            Stok
                                                        </span>
                                                    ) : (
                                                        <></>
                                                    )} */}
                                                </p>
                                                <div className="max-w-fit text-xs leading-5 text-zinc-400">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <dt className="font-semibold text-zinc-500">
                                                            {
                                                                "Başlangıç Tarihi:"
                                                            }
                                                        </dt>
                                                        <dd>
                                                            {DateFormat(
                                                                lic.startDate,
                                                            )}
                                                        </dd>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <dt className="font-semibold text-zinc-500">
                                                            {"Bitiş Tarihi:"}
                                                        </dt>
                                                        <dd>
                                                            {DateFormat(
                                                                lic.expiryDate,
                                                            )}
                                                        </dd>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <BiChevronRight className="text-2xl text-zinc-500" />
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <div className="w-full py-6 text-center">
                            <p className="text-zinc-400">
                                Bu cihaza herhangi bir lisans tanımlanmamıştır.
                            </p>
                        </div>
                    )}
                </AccordionItem>
            </Accordion>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
                backdrop="opaque"
                shadow="lg"
                isDismissable={false}
                scrollBehavior="outside"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-zinc-500">
                        Cihaz Güncelle
                    </ModalHeader>
                    <ModalBody>
                        <form
                            autoComplete="off"
                            className="flex flex-col gap-2"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div>
                                <label
                                    htmlFor="serialNo"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Seri Numarası
                                </label>
                                <input
                                    type="text"
                                    id="serialNo"
                                    required
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...register("serialNo", {
                                        required: true,
                                        maxLength: 50,
                                    })}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="productId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2 after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Ürün
                                </label>
                                <Controller
                                    control={control}
                                    name="productId"
                                    rules={{ required: true }}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <AutoComplete
                                            onChange={onChange}
                                            value={value}
                                            data={products || []}
                                        />
                                    )}
                                />
                            </div>

                            <Divider className="my-3" />

                            <div>
                                <label
                                    htmlFor="boughtAt"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Alım Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="boughtAt"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...register("boughtAt")}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="soldAt"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Satış Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="soldAt"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...register("soldAt")}
                                />
                            </div>

                            <Divider className="my-3" />

                            <div>
                                <label
                                    htmlFor="customerId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
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
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="dealerId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
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
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="subDealerId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
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
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="supplierId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
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
                                        />
                                    )}
                                />
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
                                        id="note"
                                        rows={3}
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                        {...register("note", {
                                            maxLength: 500,
                                        })}
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
        </div>
    );
}
