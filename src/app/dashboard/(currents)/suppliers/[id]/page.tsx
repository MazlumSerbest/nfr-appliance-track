"use client";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import toast from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";

import { Card, CardBody, CardFooter } from "@nextui-org/card";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/react";

import Skeleton, { DefaultSkeleton } from "@/components/loaders/Skeleton";
import BoolChip from "@/components/BoolChip";
import RegInfo from "@/components/buttons/RegInfo";
import DeleteButton from "@/components/buttons/DeleteButton";
import AuthorizedPersons from "@/components/currents/AuthorizedPersons";
import Addresses from "@/components/currents/Addresses";
import { BiInfoCircle, BiMailSend, BiPhoneOutgoing, BiX, BiCopy } from "react-icons/bi";
import useUserStore from "@/store/user";
import { CopyToClipboard } from "@/utils/functions";

interface IFormInput {
    id: number;
    active: boolean;
    type: "supplier";
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

export default function SupplierDetail({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
    const { user: currUser } = useUserStore();

    //#region Form
    const { register, reset, handleSubmit } = useForm<IFormInput>();

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
    };
    //#endregion

    const { data, error, mutate } = useSWR(`/api/current/${params.id}`, null, {
        onSuccess: (sup) => {
            reset(sup);
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
                        <div className="grid grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Aktif</dt>
                            <dd className="col-span-1 md:col-span-2">
                                <BoolChip value={data.active} />
                            </dd>
                        </div>

                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Telefon</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0 gap-2">
                                {data.phone ? (
                                    <>
                                        {"+90" + data.phone}
                                        <a href={`tel:${"+90" + data.phone}`}>
                                            <BiPhoneOutgoing className="text-xl text-green-600 cursor-pointer active:opacity-50" />
                                        </a>
                                    </>
                                ) : (
                                    "-"
                                )}
                            </dd>
                        </div>

                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Email</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0 gap-2">
                                {data.email ? (
                                    <>
                                        {data.email}
                                        <a href={`mailto:${data.email}`}>
                                            <BiMailSend className="text-xl text-sky-500 cursor-pointer active:opacity-50" />
                                        </a>
                                    </>
                                ) : (
                                    "-"
                                )}
                            </dd>
                        </div>

                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Vergi Dairesi</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {data.taxOffice || "-"}
                            </dd>
                        </div>
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Vergi No</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {data.taxNo || "-"}
                            </dd>
                        </div>
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Vade</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {data.paymentPlan || "-"}
                            </dd>
                        </div>
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">IBAN</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light gap-2 items-center mt-1 sm:mt-0">
                                {data.paymentNumber ? (
                                    <>
                                        {`TR ${data.paymentNumber}`}
                                        <BiCopy
                                            className="text-xl text-sky-500 cursor-pointer active:opacity-50"
                                            onClick={() =>
                                                CopyToClipboard(
                                                    `TR${data.paymentNumber}`,
                                                    "IBAN panoya kopyalandı!",
                                                )
                                            }
                                        />
                                    </>
                                ) : (
                                    "-"
                                )}
                            </dd>
                        </div>
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Yetkili Adı</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {data.authorizedName || "-"}
                            </dd>
                        </div>
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Yetkili Ünvanı</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {data.authorizedTitle || "-"}
                            </dd>
                        </div>

                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Şehir</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {data.city || "-"}
                            </dd>
                        </div>
                        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 w-full text-base text-zinc-500 p-2">
                            <dt className="font-medium">Adres</dt>
                            <dd className="flex flex-row col-span-1 md:col-span-2 font-light items-center mt-1 sm:mt-0">
                                {data.address || "-"}
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
                        color="primary"
                        className="bg-sky-500"
                        onPress={onOpen}
                    >
                        Düzenle
                    </Button>
                </CardFooter>
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
                        Tedarikçi Güncelle
                    </ModalHeader>
                    <ModalBody>
                        <form
                            action=""
                            autoComplete="off"
                            className="flex flex-col gap-2"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div>
                                <div className="relative flex flex-col gap-x-3">
                                    <div className="flex flex-row">
                                        <label
                                            htmlFor="active"
                                            className="text-sm font-semibold leading-6 text-zinc-500"
                                        >
                                            Aktif
                                        </label>
                                        <div className="flex h-6 ml-3 items-center">
                                            <input
                                                id="active"
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-zinc-300 ring-offset-1 focus:ring-2 focus:ring-sky-500 outline-none cursor-pointer accent-sky-600"
                                                {...register("active")}
                                            />
                                        </div>
                                    </div>
                                    <span className="flex flex-row font-normal text-xs text-zinc-400 items-center gap-1 mb-1">
                                        <BiInfoCircle />
                                        Diğer tanımlamalarda bu tedarikçinin
                                        seçilebilir olması için gereklidir!
                                    </span>
                                </div>
                            </div>
                            
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Ad
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...register("name", {
                                        required: true,
                                        maxLength: 250,
                                    })}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    Telefon
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:max-w-md">
                                        <span className="flex select-none items-center pl-3 text-zinc-400 sm:text-sm">
                                            +90
                                        </span>
                                        <input
                                            type="text"
                                            id="phone"
                                            required
                                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-zinc-700 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
                                            {...register("phone", {
                                                required: true,
                                                maxLength: 20,
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-semibold leading-6 text-zinc-500 after:content-['*'] after:ml-0.5 after:text-red-500"
                                >
                                    E-Posta
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    required
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...register("email", {
                                        required: true,
                                        maxLength: 50,
                                    })}
                                />
                            </div>

                            <Divider className="my-3" />

                            <div>
                                <label
                                    htmlFor="taxOffice"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Vergi Dairesi
                                </label>
                                <input
                                    type="text"
                                    id="taxOffice"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...register("taxOffice", {
                                        maxLength: 50,
                                    })}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="taxNo"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Vergi No
                                </label>
                                <input
                                    type="text"
                                    id="taxNo"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...register("taxNo", {
                                        maxLength: 50,
                                    })}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="paymentPlan"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Vade
                                </label>
                                <input
                                    type="text"
                                    id="paymentPlan"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...register("paymentPlan", {
                                        maxLength: 50,
                                    })}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="paymentNumber"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    IBAN
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:max-w-md">
                                        <span className="flex select-none items-center pl-3 text-zinc-400 sm:text-sm">
                                            TR
                                        </span>
                                        <input
                                            type="text"
                                            id="paymentNumber"
                                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-zinc-700 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
                                            {...register("paymentNumber", {
                                                maxLength: 50,
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Divider className="my-3" />

                            <div>
                                <label
                                    htmlFor="authorizedName"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Yetkili Adı
                                </label>
                                <input
                                    type="text"
                                    id="authorizedName"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...register("authorizedName", {
                                        maxLength: 80,
                                    })}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="authorizedTitle"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Yetkili Ünvanı
                                </label>
                                <input
                                    type="text"
                                    id="authorizedTitle"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...register("authorizedTitle", {
                                        maxLength: 80,
                                    })}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="city"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Şehir
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...register("city", {
                                        maxLength: 80,
                                    })}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="address"
                                    className="block text-sm font-semibold leading-6 text-zinc-500"
                                >
                                    Adres
                                </label>
                                <textarea
                                    id="address"
                                    rows={3}
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none mt-2"
                                    {...register("address", { maxLength: 500 })}
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
        </div>
    );
}
