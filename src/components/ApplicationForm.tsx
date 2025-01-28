import { useForm, Controller, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

import { useDisclosure } from "@heroui/modal";
import { Button } from "@heroui/button";

import AutoComplete from "@/components/AutoComplete";
import useUserStore from "@/store/user";

interface IFormInput {
    productId: number;
    serialNo: string;
    boughtAt: string;
    soldAt: string;
    note?: string;
    isDemo: boolean;
    customerId: number;
    dealerId: number;
    subDealerId: number;
    supplierId: number;
    createdBy: string;
}

type Props = {
    license: License;
    onClose: () => void;
    products: ListBoxItem[];
    customers: ListBoxItem[];
    dealers: ListBoxItem[];
    suppliers: ListBoxItem[];
};

export default function ApplicationForm({
    license,
    onClose,
    products,
    customers,
    dealers,
    suppliers,
}: Props) {
    const { user: currUser } = useUserStore();
    
    //#region Form
    const { register, reset, handleSubmit, control } = useForm<IFormInput>({
        defaultValues: {
            customerId: license.customerId,
            dealerId: license.dealerId,
            subDealerId: license.subDealerId,
            supplierId: license.supplierId,
        },
    });

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        data.createdBy = currUser?.username ?? "";

        await fetch("/api/appliance", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        }).then(async (res) => {
            const result = await res.json();

            if (result.ok) {
                const lic = {
                    id: license.id,
                    applianceId: result.data.id,
                    updatedBy: currUser?.username ?? "",
                };

                await fetch(`/api/license/${license.id}`, {
                    method: "PUT",
                    body: JSON.stringify(lic),
                    headers: { "Content-Type": "application/json" },
                }).then(async (res) => {
                    const licResult = await res.json();

                    if (licResult.ok) {
                        toast.success(result.message);
                        onClose();
                        reset();
                    } else {
                        toast.error(licResult.message);
                    }
                });
            } else {
                toast.error(result.message);
            }
            return result;
        });
    };
    //#endregion

    return (
        <form
            action=""
            autoComplete="off"
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="relative flex items-center">
                <div className="flex-grow border-t border-zinc-200"></div>
                <span className="flex-shrink mx-4 text-base text-zinc-500">
                    Ürün Bilgileri
                </span>
                <div className="flex-grow border-t border-zinc-200"></div>
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
                    htmlFor="productId"
                    className="block text-sm font-semibold leading-6 text-zinc-500 mb-2 after:content-['*'] after:ml-0.5 after:text-red-500"
                >
                    Ürün
                </label>
                <Controller
                    control={control}
                    name="productId"
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                        <AutoComplete
                            onChange={onChange}
                            value={value}
                            data={products || []}
                        />
                    )}
                />
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

            <div className="relative flex items-center mt-6">
                <div className="flex-grow border-t border-zinc-200"></div>
                <span className="flex-shrink mx-4 text-base text-zinc-500">
                    Cari Bilgileri
                </span>
                <div className="flex-grow border-t border-zinc-200"></div>
            </div>

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
                    render={({ field: { onChange, value } }) => (
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
                    render={({ field: { onChange, value } }) => (
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
                    render={({ field: { onChange, value } }) => (
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
                    render={({ field: { onChange, value } }) => (
                        <AutoComplete
                            onChange={onChange}
                            value={value}
                            data={suppliers || []}
                        />
                    )}
                />
            </div>

            <div className="relative flex items-center mt-6">
                <div className="flex-grow border-t border-zinc-200"></div>
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
                <Button color="danger" onPress={onClose} className="bg-red-600">
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
    );
}
