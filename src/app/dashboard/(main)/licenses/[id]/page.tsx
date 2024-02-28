"use client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
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

import Skeleton, { DefaultSkeleton } from "@/components/loaders/Skeleton";
import AutoComplete from "@/components/AutoComplete";
import RegInfo from "@/components/buttons/RegInfo";
import DeleteButton from "@/components/buttons/DeleteButton";
import {
    BiChevronLeft,
    BiInfoCircle,
    BiPlus,
    BiServer,
    BiX,
} from "react-icons/bi";
import { setLicenseAppliance } from "@/lib/prisma";
import { DateFormat } from "@/utils/date";
import useUserStore from "@/store/user";
import {
    getAppliances,
    getProducts,
    getLicenseTypes,
    getCustomers,
    getDealers,
    getSuppliers,
    getBoughtTypes,
} from "@/lib/data";

interface IFormInput {
    id: number;
    serialNo: string;
    startDate?: string;
    expiryDate?: string;
    boughtTypeId: number;
    boughtAt?: string;
    soldAt?: string;
    orderedAt?: string;
    note?: string;
    licenseTypeId: number;
    customerId?: number;
    dealerId?: number;
    subDealerId?: number;
    supplierId?: number;
    applianceId: number;
    updatedBy: string;
    appSerialNo?: string;
    appliance?: Appliance;
    licenseType?: LicenseType;
    boughtType?: BoughtType;
    customer?: Current;
    dealer?: Current;
    subDealer?: Current;
    supplier?: Current;
}

export default function LicenseDetail({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { user: currUser } = useUserStore();
    const {
        isOpen: isOpenApp,
        onClose: onCloseApp,
        onOpen: onOpenApp,
        onOpenChange: onOpenChangeApp,
    } = useDisclosure();

    const [products, setProducts] = useState<ListBoxItem[] | null>(null);
    const [appliances, setAppliances] = useState<ListBoxItem[] | null>(null);
    const [licenseTypes, setLicenseTypes] = useState<ListBoxItem[] | null>(
        null,
    );
    const [boughtTypes, setBoughtTypes] = useState<ListBoxItem[] | null>(null);
    const [customers, setCustomers] = useState<ListBoxItem[] | null>(null);
    const [dealers, setDealers] = useState<ListBoxItem[] | null>(null);
    const [suppliers, setSuppliers] = useState<ListBoxItem[] | null>(null);

    const { data, error, mutate } = useSWR(`/api/license/${params.id}`, null, {
        onSuccess: (lic) => {
            reset(lic);
            setValue("startDate", lic.startDate?.split("T")[0]);
            setValue("expiryDate", lic.expiryDate?.split("T")[0]);
            setValue("boughtAt", lic.boughtAt?.split("T")[0]);
            setValue("soldAt", lic.soldAt?.split("T")[0]);
            setValue("orderedAt", lic.orderedAt?.split("T")[0]);
        },
    });

    //#region Form
    const { register, reset, setValue, resetField, handleSubmit, control } =
        useForm<IFormInput>();

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        if (currUser) {
            data.updatedBy = currUser?.username ?? "";
            data.boughtTypeId = Number(data.boughtTypeId || undefined);

            delete data["appliance"];
            delete data["licenseType"];
            delete data["boughtType"];
            delete data["customer"];
            delete data["dealer"];
            delete data["subDealer"];
            delete data["supplier"];

            await fetch(`/api/license/${data.id}`, {
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
                return result;
            });
        }
    };

    const onSubmitApp: SubmitHandler<IFormInput> = async (data) => {
        if (currUser) {
            const updatedBy = currUser?.username ?? "";

            const lic = await setLicenseAppliance(
                Number(params.id),
                data.applianceId,
                updatedBy,
            );
            if (lic) {
                onCloseApp();
                mutate();
                toast.success("Lisans cihaza eklendi!");
            } else toast.error("Bir hata oluştu! Lütfen tekrar deneyiniz.");
        }
    };
    //#endregion

    //#region Data

    useEffect(() => {
        async function getData() {
            const pro: ListBoxItem[] = await getProducts(true);
            setProducts(pro);

            const lit: ListBoxItem[] = await getLicenseTypes(true);
            setLicenseTypes(lit);
            const bou: ListBoxItem[] = await getBoughtTypes(true);
            setBoughtTypes(bou);
            const cus: ListBoxItem[] = await getCustomers(true);
            setCustomers(cus);
            const deal: ListBoxItem[] = await getDealers(true);
            setDealers(deal);
            const sup: ListBoxItem[] = await getSuppliers(true);
            setSuppliers(sup);

            mutate();
        }

        getData();
    }, [mutate]);
    //#endregion

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
                <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                    <CardBody className="gap-3">
                        <div className="flex items-center pb-2 pl-1">
                            <p className="text-3xl font-bold text-sky-500">
                                {data.serialNo || "Seri Numarasız Lisans"}
                            </p>
                            <div className="flex-1"></div>
                            <BiX
                                className="text-3xl text-zinc-500 cursor-pointer active:opacity-50"
                                onClick={() => router.back()}
                            />
                        </div>
                        <div className="divide-y divide-zinc-200">
                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                                <dt className="font-medium">Durum</dt>
                                <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                    {!data.customerId &&
                                    !data.orderedAt &&
                                    !data.expiryDate ? (
                                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-sky-500 ring-1 ring-inset ring-sky-500/20">
                                            Aktif
                                        </span>
                                    ) : data.customerId &&
                                      !data.orderedAt &&
                                      !data.expiryDate ? (
                                        <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-sm font-medium text-yellow-500 ring-1 ring-inset ring-yellow-500/20">
                                            Sipariş
                                        </span>
                                    ) : data.customerId &&
                                      data.orderedAt &&
                                      !data.expiryDate ? (
                                        <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-sm font-medium text-orange-500 ring-1 ring-inset ring-orange-500/20">
                                            Bekleyen Sipariş
                                        </span>
                                    ) : data.customerId &&
                                      data.orderedAt &&
                                      data.expiryDate ? (
                                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-green-600 ring-1 ring-inset ring-green-600/20">
                                            Aktif
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-sm font-medium text-orange-500 ring-1 ring-inset ring-orange-500/20">
                                            Bekleyen Sipariş
                                        </span>
                                    )}
                                </dd>
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2 items-center">
                                {data.applianceId ? (
                                    <>
                                        <dt className="font-medium">
                                            Cihaz Seri No
                                        </dt>
                                        <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                            {data?.appliance?.serialNo}
                                        </dd>
                                    </>
                                ) : (
                                    <>
                                        <label
                                            htmlFor="appSerialNo"
                                            className="font-medium"
                                        >
                                            Cihaz Seri No
                                        </label>
                                        <input
                                            type="text"
                                            id="appSerialNo"
                                            className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                            {...register("appSerialNo", {
                                                maxLength: 50,
                                            })}
                                        />
                                    </>
                                )}
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="licenseTypeId"
                                    className="font-medium after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Lisans Tipi
                                </label>
                                <Controller
                                    control={control}
                                    name="licenseTypeId"
                                    rules={{ required: true }}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <AutoComplete
                                            onChange={onChange}
                                            value={value}
                                            data={licenseTypes || []}
                                            className="md:col-span-2 xl:col-span-1 my-1 sm:my-0"
                                        />
                                    )}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2 items-center">
                                <label
                                    htmlFor="serialNo"
                                    className="font-medium"
                                >
                                    Lisans Seri No
                                </label>
                                <input
                                    type="text"
                                    id="serialNo"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("serialNo", {
                                        maxLength: 50,
                                    })}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="startDate"
                                    className="font-medium"
                                >
                                    Başlangıç Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("startDate")}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="expiryDate"
                                    className="font-medium"
                                >
                                    Bitiş Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="expiryDate"
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("expiryDate")}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="boughtTypeId"
                                    className="font-medium"
                                >
                                    Alım Tipi
                                </label>
                                <div className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full h-10 rounded-md border-0 px-3 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2">
                                    <select
                                        id="boughtTypeId"
                                        className="w-full border-none text-sm text-zinc-700 outline-none"
                                        {...register("boughtTypeId")}
                                    >
                                        <option value={undefined}></option>
                                        {boughtTypes?.map((bt) => (
                                            <option key={bt.id} value={bt.id}>
                                                {bt.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="boughtAt"
                                    className="font-medium"
                                >
                                    Alım Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="boughtAt"
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("boughtAt")}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label htmlFor="soldAt" className="font-medium">
                                    Satış Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="soldAt"
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("soldAt")}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="orderedAt"
                                    className="font-medium"
                                >
                                    Sipariş Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="orderedAt"
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("orderedAt")}
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
                    {currUser?.role == "technical" ? (
                        <></>
                    ) : (
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
                                table="licenses"
                                data={data}
                                mutate={mutate}
                                isButton
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
                            >
                                Kaydet
                            </Button>
                        </CardFooter>
                    )}
                </form>
            </Card>

            <Accordion
                selectionMode="multiple"
                variant="splitted"
                defaultExpandedKeys={data.appliance ? ["appliance"] : []}
                className="p-0"
                itemClasses={{
                    title: "font-medium text-zinc-600",
                    base: "px-1 py-2",
                }}
            >
                <AccordionItem
                    key="appliance"
                    aria-label="appliance"
                    title="Cihaz Bilgileri"
                    subtitle="Bu lisansın ait olduğu cihaz bilgileri"
                    indicator={
                        <BiChevronLeft className="text-3xl text-zinc-500" />
                    }
                    startContent={
                        <BiServer className="text-4xl text-green-600/60" />
                    }
                >
                    {data?.appliance ? (
                        <>
                            <div className="divide-y divide-zinc-200 text-zinc-500">
                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base p-2">
                                    <dt className="font-medium">Seri No</dt>
                                    <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                        {data.appliance?.serialNo || "-"}
                                    </dd>
                                </div>

                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base p-2">
                                    <dt className="font-medium">Alım Tarihi</dt>
                                    <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                        {DateFormat(data.appliance?.boughtAt) ||
                                            "-"}
                                    </dd>
                                </div>
                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base p-2">
                                    <dt className="font-medium">
                                        Satış Tarihi
                                    </dt>
                                    <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                        {DateFormat(data.appliance?.soldAt) ||
                                            "-"}
                                    </dd>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1"></div>
                                <Button
                                    color="primary"
                                    className="bg-sky-500"
                                    onPress={() =>
                                        router.push(
                                            `/dashboard/appliances/${data.appliance?.id}`,
                                        )
                                    }
                                >
                                    Cihaza Git
                                </Button>
                                {currUser?.role === "technical" ? undefined : (
                                    <>
                                        <Button
                                            color="primary"
                                            className="bg-red-500"
                                            onPress={async () => {
                                                if (currUser) {
                                                    const updatedBy =
                                                        currUser?.username ??
                                                        "";

                                                    const lic =
                                                        await setLicenseAppliance(
                                                            Number(params.id),
                                                            null,
                                                            updatedBy,
                                                        );
                                                    if (lic) {
                                                        onCloseApp();
                                                        mutate();
                                                        toast.success(
                                                            "Lisans cihazdan silindi!",
                                                        );
                                                    } else
                                                        toast.error(
                                                            "Bir hata oluştu! Lütfen tekrar deneyiniz.",
                                                        );
                                                }
                                            }}
                                        >
                                            Cihazı Sil
                                        </Button>
                                        <Button
                                            color="primary"
                                            className="bg-green-600"
                                            onPress={onOpenApp}
                                        >
                                            Cihaz Değiştir
                                        </Button>
                                    </>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="w-full py-3 text-center">
                            <p className="text-zinc-400">
                                Bu lisans herhangi bir cihaza ait değildir.
                            </p>
                            {currUser?.role === "technical" ? undefined : (
                                <Button
                                    color="primary"
                                    className="bg-sky-500 mt-3"
                                    endContent={<BiPlus />}
                                    onPress={onOpenApp}
                                >
                                    Cihaz Ekle
                                </Button>
                            )}
                        </div>
                    )}
                </AccordionItem>
            </Accordion>

            <Modal
                isOpen={isOpenApp}
                onOpenChange={onOpenChangeApp}
                size="lg"
                placement="center"
                backdrop="opaque"
                shadow="lg"
                isDismissable={false}
                scrollBehavior="outside"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-zinc-500">
                        Cihaz Ekleme
                    </ModalHeader>
                    <ModalBody>
                        <form
                            action=""
                            autoComplete="off"
                            className="flex flex-col gap-2"
                            onSubmit={handleSubmit(onSubmitApp)}
                        >
                            <div>
                                <label
                                    htmlFor="product"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                                >
                                    Ürün
                                </label>
                                <AutoComplete
                                    onChange={async (e) => {
                                        resetField("applianceId");
                                        const appliances: ListBoxItem[] =
                                            await getAppliances(true, e);
                                        setAppliances(appliances);
                                    }}
                                    data={products || []}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="applianceId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Cihaz
                                </label>
                                <span className="flex flex-row font-normal text-xs text-zinc-400 items-center gap-1 mb-1">
                                    <BiInfoCircle />
                                    Cihaz seçmek için ürün seçimi yapmanız
                                    gereklidir!
                                </span>
                                <Controller
                                    control={control}
                                    name="applianceId"
                                    rules={{ required: true }}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <AutoComplete
                                            onChange={onChange}
                                            value={value}
                                            data={appliances || []}
                                        />
                                    )}
                                />
                            </div>

                            <div className="flex flex-row gap-2 mt-4">
                                <div className="flex-1"></div>
                                <Button
                                    color="danger"
                                    onPress={onCloseApp}
                                    className="bg-red-600"
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
