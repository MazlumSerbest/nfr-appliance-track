"use client";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import toast from "react-hot-toast";

import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Switch } from "@nextui-org/switch";
import { Button } from "@nextui-org/button";

import Skeleton, { DefaultSkeleton } from "@/components/loaders/Skeleton";
import RegInfo from "@/components/buttons/RegInfo";
import DeleteButton from "@/components/buttons/DeleteButton";
import AuthorizedPersons from "@/components/currents/AuthorizedPersons";
import Addresses from "@/components/currents/Addresses";
import {
    BiMailSend,
    BiPhoneOutgoing,
    BiX,
    BiCopy,
} from "react-icons/bi";
import useUserStore from "@/store/user";
import { CopyToClipboard } from "@/utils/functions";

interface IFormInput {
    id: number;
    active: boolean;
    type: "customer";
    name: string;
    phone: string;
    email: string;
    taxOffice: string;
    taxNo: string;
    paymentPlan: string;
    paymentNumber: string;
    authorizedName: string;
    authorizedTitle: string;
    city: string;
    address: string;
    updatedBy: string;
    authorizedPersons?: AuthorizedPerson[];
    addresses?: Address[];
}

export default function CustomerDetail({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { user: currUser } = useUserStore();

    //#region Form
    const { register, reset, handleSubmit, control } = useForm<IFormInput>();

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        data.updatedBy = currUser?.username ?? "";
        delete data["authorizedPersons"];
        delete data["addresses"];

        await fetch(`/api/current/${data.id}`, {
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
    //#endregion

    const { data, error, mutate } = useSWR(`/api/current/${params.id}`, null, {
        onSuccess: (cus) => {
            reset(cus);
        },
    });

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
                                {data.name}
                            </p>
                            <div className="flex-1"></div>
                            <BiX
                                className="text-3xl text-zinc-500 cursor-pointer active:opacity-50"
                                onClick={() => router.back()}
                            />
                        </div>
                        <div className="divide-y divide-zinc-200">
                            <div className="grid grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <div>
                                    <label
                                        htmlFor="active"
                                        className="font-medium"
                                    >
                                        Aktif
                                    </label>
                                </div>
                                {/* <input
                                    id="active"
                                    type="checkbox"
                                    className="md:col-span-2 my-1 sm:my-0 h-4 w-4 rounded-md border-zinc-300 ring-offset-1 focus:ring-2 focus:ring-sky-500 outline-none cursor-pointer accent-sky-600"
                                    {...register("active")}
                                /> */}
                                <Controller
                                    control={control}
                                    name="active"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <Switch
                                            color="primary"
                                            onChange={onChange}
                                            isSelected={value}
                                            classNames={{
                                                wrapper: "group-data-[selected=true]:bg-sky-500"
                                            }}
                                        />
                                    )}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="name"
                                    className="font-medium after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Ad
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    className="md:col-span-2 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("name", {
                                        required: true,
                                        maxLength: 250,
                                    })}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <div className="flex flex-row items-center gap-2">
                                    <label
                                        htmlFor="phone"
                                        className="font-medium after:content-['*'] after:ml-0.5 after:text-red-500"
                                    >
                                        Telefon
                                    </label>
                                    {data.phone ? (
                                        <a href={`tel:${"+90" + data.phone}`}>
                                            <BiPhoneOutgoing className="text-xl text-green-600 cursor-pointer active:opacity-50" />
                                        </a>
                                    ) : (
                                        <></>
                                    )}
                                </div>

                                <div>
                                    <div className="flex md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:max-w-md">
                                        <span className="flex select-none items-center pl-3 text-zinc-400 sm:text-sm">
                                            +90
                                        </span>
                                        <input
                                            type="text"
                                            id="phone"
                                            required
                                            className="block flex-1 border-0 bg-transparent pl-1 pr-3.5 py-2 text-zinc-700 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
                                            {...register("phone", {
                                                required: true,
                                                maxLength: 50,
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <div className="flex flex-row items-center gap-2">
                                    <label
                                        htmlFor="email"
                                        className="font-medium after:content-['*'] after:ml-0.5 after:text-red-500"
                                    >
                                        Email
                                    </label>
                                    {data.email ? (
                                        <a href={`mailto:${data.email}`}>
                                            <BiMailSend className="text-xl text-sky-500 cursor-pointer active:opacity-50" />
                                        </a>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    id="email"
                                    required
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("email", {
                                        required: true,
                                        maxLength: 50,
                                    })}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="taxOffice"
                                    className="font-medium"
                                >
                                    Vergi Dairesi
                                </label>
                                <input
                                    type="text"
                                    id="taxOffice"
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("taxOffice", {
                                        maxLength: 80,
                                    })}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label htmlFor="taxNo" className="font-medium">
                                    Vergi No
                                </label>
                                <input
                                    type="text"
                                    id="taxNo"
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("taxNo", {
                                        maxLength: 50,
                                    })}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label htmlFor="taxNo" className="font-medium">
                                    Vade
                                </label>
                                <input
                                    type="text"
                                    id="paymentPlan"
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("paymentPlan", {
                                        maxLength: 50,
                                    })}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <div className="flex flex-row items-center gap-2">
                                    <label
                                        htmlFor="paymentNumber"
                                        className="font-medium"
                                    >
                                        IBAN
                                    </label>
                                    {data.paymentNumber ? (
                                        <BiCopy
                                            className="text-xl text-sky-500 cursor-pointer active:opacity-50"
                                            onClick={() =>
                                                CopyToClipboard(
                                                    `TR${data.paymentNumber}`,
                                                    "IBAN panoya kopyalandı!",
                                                )
                                            }
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                <div>
                                    <div className="flex md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:max-w-md">
                                        <span className="flex select-none items-center pl-3 text-zinc-400 sm:text-sm">
                                            TR
                                        </span>
                                        <input
                                            type="text"
                                            id="paymentNumber"
                                            className="block flex-1 border-0 bg-transparent pl-1 pr-3.5 py-2 text-zinc-700 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
                                            {...register("paymentNumber", {
                                                maxLength: 50,
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="authorizedName"
                                    className="font-medium"
                                >
                                    Yetkili Adı
                                </label>
                                <input
                                    type="text"
                                    id="authorizedName"
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("authorizedName", {
                                        maxLength: 80,
                                    })}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="authorizedTitle"
                                    className="font-medium"
                                >
                                    Yetkili Ünvanı
                                </label>
                                <input
                                    type="text"
                                    id="authorizedTitle"
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("authorizedTitle", {
                                        maxLength: 80,
                                    })}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label htmlFor="city" className="font-medium">
                                    Şehir
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    className="md:col-span-2 xl:col-span-1 my-1 sm:my-0 w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none"
                                    {...register("city", {
                                        maxLength: 80,
                                    })}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 py-1 px-2 items-center">
                                <label
                                    htmlFor="address"
                                    className="font-medium"
                                >
                                    Adres
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
                        </div>
                    </CardBody>
                    <CardFooter className="flex gap-2">
                        <div className="flex-1"></div>
                        <RegInfo
                            data={data}
                            isButton
                            trigger={
                                <Button color="primary" className="bg-sky-500">
                                    Kayıt Bilgisi
                                </Button>
                            }
                        />

                        <DeleteButton
                            table="currents"
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
                            type="submit"
                            color="primary"
                            className="text-white bg-green-600"
                        >
                            Kaydet
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <AuthorizedPersons
                currentId={data?.id}
                currentType={data?.type}
                personList={data?.authorizedPersons}
                mutate={mutate}
            />

            <Addresses
                currentId={data?.id}
                currentType={data?.type}
                addressList={data?.addresses}
                mutate={mutate}
            />
        </div>
    );
}
