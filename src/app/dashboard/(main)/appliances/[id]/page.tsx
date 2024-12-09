"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Button } from "@nextui-org/button";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
} from "@nextui-org/modal";

import Skeleton, { DefaultSkeleton } from "@/components/loaders/Skeleton";
import RegInfo from "@/components/buttons/RegInfo";
import DeleteButton from "@/components/buttons/DeleteButton";
import AutoComplete from "@/components/AutoComplete";
import {
    BiX,
    BiCheckShield,
    BiChevronLeft,
    BiChevronRight,
    BiUserCircle,
    BiEdit,
    BiTrash,
    BiInfoCircle,
} from "react-icons/bi";
import useUserStore from "@/store/user";
import { DateFormat } from "@/utils/date";
import {
    getProducts,
    getCustomers,
    getDealers,
    getSuppliers,
} from "@/lib/data";
import { setApplianceDemoStatus } from "@/lib/prisma";

interface IFormInput {
    id: number;
    productId: number;
    serialNo: string;
    boughtAt: string;
    soldAt: string;
    note?: string;
    customerId: number;
    cusName?: string;
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
    history?: ApplianceHistory[];
}

interface IHistoryFormInput {
    id: number;
    applianceId: number;
    customerId?: number;
    cusName: string;
    boughtAt?: string | null;
    soldAt?: string | null;
    updatedBy: string;
    customer?: Current;
}

export default function ApplianceDetail({
    params,
}: {
    params: { id: string };
}) {
    const router = useRouter();
    const { user: currUser } = useUserStore();
    const [historyIsNew, setHistoryIsNew] = useState(false);

    const {
        isOpen: isOpenHistory,
        onClose: onCloseHistory,
        onOpen: onOpenHistory,
        onOpenChange: onOpenChangeHistory,
    } = useDisclosure();

    const [products, setProducts] = useState<ListBoxItem[] | null>(null);
    const [customers, setCustomers] = useState<ListBoxItem[] | null>(null);
    const [dealers, setDealers] = useState<ListBoxItem[] | null>(null);
    const [suppliers, setSuppliers] = useState<ListBoxItem[] | null>(null);

    //#region Form
    const { register, reset, handleSubmit, control, setValue } =
        useForm<IFormInput>({});

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        data.updatedBy = currUser?.username ?? "";
        console.log(data);

        delete data["product"];
        delete data["licenses"];
        delete data["customer"];
        delete data["dealer"];
        delete data["subDealer"];
        delete data["supplier"];
        delete data["history"];

        await fetch(`/api/appliance/${data.id}`, {
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
    };

    const {
        register: registerHistory,
        reset: resetHistory,
        setValue: setHistoryValue,
        handleSubmit: handleHistorySubmit,
        control: controlHistory,
    } = useForm<IHistoryFormInput>();

    const onSubmitHistory: SubmitHandler<IHistoryFormInput> = async (d) => {
        if (currUser) {
            const applianceWithNewHistory = {
                id: data.id,
                customerId: Number(d.customerId) || null,
                cusName: d.cusName || null,
                boughtAt: d.boughtAt || null,
                soldAt: d.soldAt || null,
                updatedBy: currUser?.username ?? "",
                history: {
                    customerId: data.customerId || null,
                    cusName: data.cusName || null,
                    boughtAt: data.boughtAt || null,
                    soldAt: data.soldAt || null,
                },
            };

            await fetch(`/api/appliance/${data.id}/history`, {
                method: "PUT",
                body: JSON.stringify(applianceWithNewHistory),
                headers: { "Content-Type": "application/json" },
            }).then(async (res) => {
                const result = await res.json();
                if (result.ok) {
                    mutate();
                    resetHistory();
                    onCloseHistory();
                    toast.success(result.message);
                } else {
                    toast.error(result.message);
                }
                return result;
            });
        }
    };

    const onSubmitHistoryUpdate: SubmitHandler<IHistoryFormInput> = async (
        data,
    ) => {
        if (currUser) {
            data.updatedBy = currUser?.username ?? "";

            delete data["customer"];

            await fetch(`/api/appliance/${params.id}/history/${data.id}`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            }).then(async (res) => {
                const result = await res.json();
                if (result.ok) {
                    mutate();
                    resetHistory();
                    onCloseHistory();
                    toast.success(result.message);
                } else {
                    toast.error(result.message);
                }
                return result;
            });
        }
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
            revalidateOnFocus: false,
            onSuccess: (app) => {
                reset(app);
                setValue("boughtAt", app.boughtAt?.split("T")[0]);
                setValue("soldAt", app.soldAt?.split("T")[0]);
            },
        },
    );

    if (error) return <div>Yükleme Hatası!</div>;
    if (!data || !products || !customers || !dealers || !suppliers)
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
                                {data.serialNo +
                                    (data.isDemo ? " (Demo Cihaz)" : "")}
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
                                    {data.isDemo ? (
                                        <span className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-1 text-sm font-medium text-zinc-500 ring-1 ring-inset ring-zinc-500/20">
                                            Demo
                                        </span>
                                    ) : !data.customerId && !data.cusName ? (
                                        <span className="inline-flex items-center rounded-md bg-sky-50 px-2 py-1 text-sm font-medium text-sky-500 ring-1 ring-inset ring-sky-500/20">
                                            Stok
                                        </span>
                                    ) : !data.soldAt ? (
                                        <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-sm font-medium text-yellow-500 ring-1 ring-inset ring-yellow-500/20">
                                            Sipariş
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-green-600 ring-1 ring-inset ring-green-600/20">
                                            Aktif
                                        </span>
                                    )}
                                </dd>
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="serialNo"
                                    className="font-medium after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Seri Numarası
                                </label>
                                <input
                                    type="text"
                                    id="serialNo"
                                    required
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("serialNo", {
                                        required: true,
                                        maxLength: 50,
                                    })}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="productId"
                                    className="font-medium after:content-['*'] after:ml-0.5 after:text-red-500"
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
                                            className="md:col-span-2 xl:col-span-1 my-1 sm:my-0"
                                        />
                                    )}
                                />
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

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2 items-center">
                                <label
                                    htmlFor="cusName"
                                    className="font-medium after:content-['*'] after:ml-0.5"
                                >
                                    Müşteri Adı
                                </label>
                                <input
                                    type="text"
                                    id="cusName"
                                    placeholder="Müşteri seçimi yapılmayacaksa bu alanı doldurunuz!"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("cusName", {
                                        maxLength: 250,
                                    })}
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

                            <Button
                                color="primary"
                                className="bg-zinc-500"
                                onClick={async () => {
                                    const res = await setApplianceDemoStatus(
                                        data.id,
                                        !data.isDemo,
                                        currUser?.username,
                                    );
                                    mutate();

                                    if (res)
                                        toast.success(
                                            "Cihaz durumu başarıyla güncellendi.",
                                        );
                                    else
                                        toast.error(
                                            "Cihaz durumu güncellenirken bir hata oluştu.",
                                        );
                                }}
                            >
                                {data.isDemo
                                    ? "Demolardan Çıkart"
                                    : "Demo Cihaz Yap"}
                            </Button>

                            <Button
                                color="primary"
                                className="bg-yellow-500"
                                onPress={() => {
                                    setHistoryIsNew(true);
                                    resetHistory({});
                                    resetHistory({});
                                    setHistoryValue(
                                        "customerId",
                                        data.customerId,
                                    );
                                    onOpenHistory();
                                }}
                            >
                                Yeni Müşteri Ekle
                            </Button>

                            <DeleteButton
                                table="appliances"
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
                                <li key={0}></li>
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
                                                    {lic.licenseType?.brand
                                                        ?.name +
                                                        " " +
                                                        lic.licenseType?.type}
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
                                                <div className="max-w-96 text-xs leading-5 text-zinc-400">
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

            <Accordion
                selectionMode="multiple"
                variant="splitted"
                defaultExpandedKeys={
                    data.history.length != 0 ? ["history"] : []
                }
                className="p-0"
                itemClasses={{
                    title: "font-medium text-zinc-600",
                    base: "px-1 py-2",
                }}
            >
                <AccordionItem
                    key="history"
                    aria-label="applihistoryance"
                    title="Geçmiş Müşteri Bilgileri"
                    subtitle="Bu cihazın geçmiş müşteri bilgileri"
                    indicator={
                        <BiChevronLeft className="text-3xl text-zinc-500" />
                    }
                    startContent={
                        <BiUserCircle className="text-4xl text-yellow-500/60" />
                    }
                >
                    {data.history.length > 0 ? (
                        <>
                            <ul
                                role="list"
                                className="divide-y divide-zinc-200"
                            >
                                <li key={0}></li>
                                {data.history.map((h: ApplianceHistory) => (
                                    <li
                                        key={h.id}
                                        className="flex justify-between py-2 items-center"
                                    >
                                        <div className="min-w-0 flex-auto">
                                            <div className="flex flex-row gap-2 items-center">
                                                <p className="text-sm font-semibold leading-6 text-zinc-600">
                                                    {h.customer?.name ||
                                                        h.cusName}
                                                </p>
                                                {currUser?.role ==
                                                "technical" ? (
                                                    <></>
                                                ) : (
                                                    <>
                                                        <RegInfo
                                                            data={h}
                                                            trigger={
                                                                <span>
                                                                    <BiInfoCircle />
                                                                </span>
                                                            }
                                                        />

                                                        <BiEdit
                                                            className="text-xl text-green-600 cursor-pointer"
                                                            onClick={() => {
                                                                setHistoryIsNew(
                                                                    false,
                                                                );
                                                                resetHistory(h);
                                                                setHistoryValue(
                                                                    "boughtAt",
                                                                    h.boughtAt?.split(
                                                                        "T",
                                                                    )[0],
                                                                );
                                                                setHistoryValue(
                                                                    "soldAt",
                                                                    h.soldAt?.split(
                                                                        "T",
                                                                    )[0],
                                                                );
                                                                setHistoryValue(
                                                                    "customerId",
                                                                    h.customer
                                                                        ?.id,
                                                                );
                                                                onOpenHistory();
                                                            }}
                                                        />

                                                        <DeleteButton
                                                            table="applianceHistory"
                                                            data={h}
                                                            mutate={mutate}
                                                            trigger={
                                                                <span>
                                                                    <BiTrash />
                                                                </span>
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </div>

                                            <div className="max-w-96 text-xs leading-5 text-zinc-400">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <dt className="font-semibold text-zinc-500">
                                                        Alım Tarihi:
                                                    </dt>
                                                    <dd>
                                                        {h.boughtAt
                                                            ? DateFormat(
                                                                  h.boughtAt,
                                                              )
                                                            : "-"}
                                                    </dd>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <dt className="font-semibold text-zinc-500">
                                                        Satış Tarihi:
                                                    </dt>
                                                    <dd>
                                                        {DateFormat(h.soldAt) ||
                                                            "-"}
                                                    </dd>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <div className="w-full py-6 text-center">
                            <p className="text-zinc-400">
                                Bu cihazın geçmişte herhangi bir müşterisi
                                bulunmuyor.
                            </p>
                        </div>
                    )}
                </AccordionItem>
            </Accordion>

            <Modal
                isOpen={isOpenHistory}
                onOpenChange={onOpenChangeHistory}
                size="lg"
                placement="center"
                backdrop="opaque"
                shadow="lg"
                isDismissable={false}
                scrollBehavior="outside"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-zinc-500">
                        {historyIsNew
                            ? "Yeni Satın Alım"
                            : "Satın Alım Güncelleme"}
                    </ModalHeader>
                    <ModalBody>
                        <form
                            autoComplete="off"
                            className="flex flex-col gap-2"
                            onSubmit={
                                historyIsNew
                                    ? handleHistorySubmit(onSubmitHistory)
                                    : handleHistorySubmit(onSubmitHistoryUpdate)
                            }
                        >
                            <div>
                                <label
                                    htmlFor="cusName"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2 after:content-['*'] after:ml-0.5"
                                >
                                    Müşteri Adı
                                </label>
                                <input
                                    type="text"
                                    id="cusName"
                                    placeholder="Müşteri seçimi yapılmayacaksa bu alanı doldurunuz!"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...registerHistory("cusName", {
                                        maxLength: 250,
                                    })}
                                />
                            </div>

                            <div className="relative flex items-center mt-2">
                                <div className="flex-grow border-t border-zinc-200"></div>
                                <span className="flex-shrink mx-4 text-xs text-zinc-500">
                                    veya
                                </span>
                                <div className="flex-grow border-t border-zinc-200"></div>
                            </div>

                            <div>
                                <label
                                    htmlFor="dealerId"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                                >
                                    Müşteri
                                </label>
                                <Controller
                                    control={controlHistory}
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
                                    htmlFor="boughtAt"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2"
                                >
                                    Alım Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="boughtAt"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...registerHistory("boughtAt")}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="soldAt"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2 after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Satış Tarihi
                                </label>
                                <input
                                    required
                                    type="date"
                                    id="soldAt"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...registerHistory("soldAt", {
                                        required: true,
                                    })}
                                />
                            </div>

                            <div className="flex flex-row gap-2 mt-4">
                                <div className="flex-1"></div>
                                <Button
                                    color="danger"
                                    onPress={onCloseHistory}
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
