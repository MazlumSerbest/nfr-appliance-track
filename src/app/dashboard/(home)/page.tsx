"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PanelCard from "@/components/PanelCard";

import { CircularProgress, Progress } from "@nextui-org/progress";
import { Divider } from "@nextui-org/divider";

import {
    BiServer,
    BiShieldPlus,
    BiShieldMinus,
    BiShieldQuarter,
    BiCheckCircle,
    BiInfoCircle,
    BiErrorCircle,
} from "react-icons/bi";
import Skeleton, { TableSkeleton } from "@/components/loaders/Skeleton";
import { getLicenseCounts, getApplianceCounts } from "@/lib/prisma";

export default function Dashboard() {
    const router = useRouter();
    const [licenseCounts, setLicenseCounts] = useState<vLicenseCounts>();
    const [applianceCounts, setApplianceCounts] = useState<vApplianceCounts>();

    useEffect(() => {
        async function getData() {
            const lic: any = await getLicenseCounts();
            setLicenseCounts(lic);
            const app: any = await getApplianceCounts();
            setApplianceCounts(app);
        }

        getData();
    }, []);

    if (!licenseCounts) {
        return (
            <div className="flex flex-col items-center">
                <div className="max-w-[1040px]">
                    <Skeleton>
                        <TableSkeleton />
                    </Skeleton>
                </div>
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-6 items-center">
            <section className="w-full max-w-[1040px]">
                <div className="flex flex-col gap-1 mt-3 md:mt-0">
                    <h1 className="text-2xl font-semibold text-zinc-600">
                        Cihazlar
                    </h1>
                    <p className="text-sm text-zinc-400">
                        Cihazların durumuyla alakalı bilgiler.
                    </p>
                </div>

                <Divider className="mt-2 mb-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mt-4 md:mt-0">
                    <PanelCard
                        header="STOKLAR"
                        color="sky"
                        content={
                            <span className="flex-wrap break-all text-pretty">
                                {applianceCounts?.stockCount?.toLocaleString() ||
                                    "-"}
                            </span>
                        }
                        icon={<BiServer />}
                    />
                    <PanelCard
                        header="SİPARİŞLER"
                        color="yellow"
                        content={
                            <span className="flex-wrap break-all text-pretty">
                                {applianceCounts?.orderCount?.toLocaleString() ||
                                    "-"}
                            </span>
                        }
                        icon={<BiServer />}
                    />
                    <PanelCard
                        header="AKTİFLER"
                        color="green"
                        content={
                            <span className="flex-wrap break-all text-pretty">
                                {applianceCounts?.activeCount?.toLocaleString() ||
                                    "-"}
                            </span>
                        }
                        icon={<BiServer />}
                    />
                </div>
            </section>

            <section className="w-full max-w-[1040px]">
                <div className="flex flex-col gap-1 mt-3 md:mt-0">
                    <h1 className="text-2xl font-semibold text-zinc-600">
                        Lisanslar
                    </h1>
                    <p className="text-sm text-zinc-400">
                        Lisansların durumuyla alakalı bilgiler.
                    </p>
                </div>

                <Divider className="mt-3 mb-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mt-4 md:mt-0">
                    <PanelCard
                        header="STOKLAR"
                        color="sky"
                        content={
                            <span className="flex-wrap break-all text-pretty">
                                {licenseCounts?.stockCount?.toLocaleString() ||
                                    "-"}
                            </span>
                        }
                        icon={<BiShieldPlus />}
                    />
                    <PanelCard
                        header="SİPARİŞLER"
                        color="yellow"
                        content={
                            <span className="flex-wrap break-all text-pretty">
                                {licenseCounts?.orderCount?.toLocaleString() ||
                                    "-"}
                            </span>
                        }
                        icon={<BiShieldMinus />}
                    />
                    <PanelCard
                        header="BEKLEYEN SİPARİŞLER"
                        color="orange"
                        content={
                            <span className="flex-wrap break-all text-pretty">
                                {licenseCounts?.waitingCount?.toLocaleString() ||
                                    "-"}
                            </span>
                        }
                        icon={<BiShieldQuarter />}
                    />
                    <PanelCard
                        header="AKTİFLER"
                        color="green"
                        content={
                            <span className="flex-wrap break-all text-pretty">
                                {licenseCounts?.activeCount?.toLocaleString() ||
                                    "-"}
                            </span>
                        }
                        icon={<BiCheckCircle />}
                        onClick={() => {
                            router.push("/dashboard/licenses");
                        }}
                    />
                </div>

                <Divider className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 md:mt-0">
                    <PanelCard
                        header="DEVAM EDEN"
                        color="green"
                        content={
                            <span className="flex-wrap break-all text-pretty">
                                {licenseCounts?.continuesCount?.toLocaleString() ||
                                    "-"}
                            </span>
                        }
                        icon={<BiCheckCircle />}
                        onClick={() => {
                            router.push("/dashboard/licenses");
                        }}
                    />
                    <PanelCard
                        header="30 GÜNDEN AZ SÜRESİ OLAN"
                        color="yellow"
                        content={
                            <span className="flex-wrap break-all text-pretty">
                                {licenseCounts?.endingCount?.toLocaleString() ||
                                    "-"}
                            </span>
                        }
                        icon={<BiInfoCircle />}
                        onClick={() => {
                            router.push("/dashboard/licenses");
                        }}
                    />
                    <PanelCard
                        header="SÜRESİ BİTEN"
                        color="red"
                        content={
                            <span className="flex-wrap break-all text-pretty">
                                {licenseCounts?.endedCount?.toLocaleString() ||
                                    "-"}
                            </span>
                        }
                        icon={<BiErrorCircle />}
                    />
                </div>
            </section>
        </div>
    );
}
