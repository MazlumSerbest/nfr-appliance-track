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
import { Divider } from "@nextui-org/divider";

import Skeleton, { DefaultSkeleton } from "@/components/loaders/Skeleton";
import BoolChip from "@/components/BoolChip";
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
    isStock: boolean;
    serialNo: string;
    startDate?: string;
    expiryDate?: string;
    boughtTypeId: number;
    boughtAt?: string;
    soldAt?: string;
    licenseTypeId: number;
    customerId?: number;
    dealerId?: number;
    subDealerId?: number;
    supplierId?: number;
    applianceId: number;
    updatedBy: string;
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
    const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
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

    //#region Form
    const { register, reset, resetField, handleSubmit, control } =
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
                if (res.ok) {
                    toast.success(result.message);
                    onClose();
                    reset();
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
                reset();
                mutate();
                toast.success("Lisans cihaza eklendi!");
            } else toast.error("Bir hata oluştu! Lütfen tekrar deneyiniz.");
        }
    };
    //#endregion

    //#region Data
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
    }

    useEffect(() => {
        getData();
    }, []);
    //#endregion

    const { data, error, mutate } = useSWR(`/api/license/${params.id}`,
    null,
    {
        onSuccess: (lic) => {
            reset(lic);
        },
    },);

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
                            {data.serialNo || "Seri Numarasız Lisans"}
                        </p>
                        <div className="flex-1"></div>
                        <BiX
                            className="text-3xl text-zinc-500 cursor-pointer active:opacity-50"
                            onClick={() => router.back()}
                        />
                    </div>
                    <div className="divide-y divide-zinc-200">
                        <div className="grid grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Stok Lisans</dt>
                            <dd className="col-span-1 md:col-span-2">
                                <BoolChip value={data.isStock} />
                            </dd>
                        </div>

                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Lisans Tipi</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {data.licenseType?.type}
                            </dd>
                        </div>

                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Lisans Süresi</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {data.licenseType?.duration
                                    ? data.licenseType?.duration + " ay"
                                    : "-"}
                            </dd>
                        </div>

                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Başlangıç Tarihi</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {DateFormat(data.startDate) || "-"}
                            </dd>
                        </div>
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Bitiş Tarihi</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {DateFormat(data.expiryDate) || "-"}
                            </dd>
                        </div>

                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Alım Tipi</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {data.boughtType?.type || "-"}
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
                        table="licenses"
                        data={data}
                        mutate={mutate}
                        isButton
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

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="lg"
                placement="center"
                backdrop="opaque"
                shadow="lg"
                isDismissable={false}
                scrollBehavior="outside"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-zinc-500">
                        Lisans Güncelleme
                    </ModalHeader>
                    <ModalBody>
                        <form
                            autoComplete="off"
                            className="flex flex-col gap-2"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div>
                                <div className="relative flex flex-col gap-x-3">
                                    <div className="flex flex-row">
                                        <label
                                            htmlFor="isStock"
                                            className="text-sm font-semibold leading-6 text-zinc-500"
                                        >
                                            Stok Lisans
                                        </label>
                                        <div className="flex h-6 ml-3 items-center">
                                            <input
                                                id="isStock"
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-zinc-300 ring-offset-1 focus:ring-2 focus:ring-sky-500 outline-none cursor-pointer accent-sky-600"
                                                {...register("isStock")}
                                            />
                                        </div>
                                    </div>
                                    <span className="flex flex-row font-normal text-xs text-zinc-400 items-center gap-1 mb-1">
                                        <BiInfoCircle />
                                        Lisans stok kontrolü için gereklidir!
                                    </span>
                                </div>
                            </div>
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
                                    htmlFor="licenseTypeId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
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
                                        />
                                    )}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="startDate"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Başlangıç Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...register("startDate", {})}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="expiryDate"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Bitiş Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="expiryDate"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...register("expiryDate", {})}
                                />
                            </div>

                            <Divider className="my-3" />

                            <div>
                                <label
                                    htmlFor="boughtTypeId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Alım Tipi
                                </label>
                                <div className="block w-full h-10 rounded-md border-0 px-3 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2">
                                    <select
                                        id="boughtType"
                                        className="w-full border-none text-sm text-zinc-700 outline-none"
                                        {...register("boughtTypeId", {})}
                                    >
                                        <option disabled selected value="">
                                            Satın alım tipi Seçiniz...
                                        </option>
                                        {boughtTypes?.map((bt) => (
                                            <option key={bt.id} value={bt.id}>
                                                {bt.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
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
                                    {...register("boughtAt", {})}
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
                                    {...register("soldAt", {})}
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

                            <div className="flex flex-row gap-2 mt-4">
                                <div className="flex-1"></div>
                                <Button
                                    color="danger"
                                    onPress={onClose}
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
                                    onPress={onOpenApp}
                                >
                                    Cihaz Değiştir
                                </Button>
                                <Button
                                    color="primary"
                                    className="bg-green-600"
                                    onPress={() =>
                                        router.push(
                                            `/dashboard/appliances/${data.appliance?.id}`,
                                        )
                                    }
                                >
                                    Cihaza Git
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="w-full py-3 text-center">
                            <p className="text-zinc-400">
                                Bu lisans herhangi bir cihaza ait değildir.
                            </p>
                            <Button
                                color="primary"
                                className="bg-sky-500 mt-3"
                                endContent={<BiPlus />}
                                onPress={onOpenApp}
                            >
                                Cihaz Ekle
                            </Button>
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
