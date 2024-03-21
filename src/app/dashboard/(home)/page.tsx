"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PanelCard from "@/components/PanelCard";

import { CircularProgress, Progress } from "@nextui-org/progress";
import { Divider } from "@nextui-org/divider";

import {
    BiServer,
    BiShieldPlus,
    BiShieldQuarter,
    BiBriefcase,
    BiShield,
} from "react-icons/bi";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie, Doughnut } from "react-chartjs-2";
import Skeleton, { TableSkeleton } from "@/components/loaders/Skeleton";
import {
    getLicenseCounts,
    getApplianceCounts,
    getProjectCounts,
} from "@/lib/prisma";
import { Card, CardBody } from "@nextui-org/react";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
    const router = useRouter();
    const [licenseCounts, setLicenseCounts] = useState<vLicenseCounts>();
    const [applianceCounts, setApplianceCounts] = useState<vApplianceCounts>();
    const [projectCounts, setProjectCounts] = useState<vProjectCounts>();

    useEffect(() => {
        async function getData() {
            const lic: any = await getLicenseCounts();
            setLicenseCounts(lic);
            const app: any = await getApplianceCounts();
            setApplianceCounts(app);
            const pro: any = await getProjectCounts();
            setProjectCounts(pro);
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
                        Projeler
                    </h1>
                    {/* <p className="text-sm text-zinc-400">
                        Cihazların durumuyla alakalı bilgiler.
                    </p> */}
                </div>

                <Divider className="mt-2 mb-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 md:mt-0">
                    <PanelCard
                        header="BEKLEYEN"
                        color="sky"
                        content={
                            <span className="flex-wrap break-all text-pretty">
                                {projectCounts?.activeCount?.toLocaleString() ||
                                    "0"}
                            </span>
                        }
                        icon={<BiBriefcase />}
                    />
                    <PanelCard
                        header="KAZANILAN"
                        color="green"
                        content={
                            <span className="flex-wrap break-all text-pretty">
                                {projectCounts?.winCount?.toLocaleString() ||
                                    "0"}
                            </span>
                        }
                        icon={<BiBriefcase />}
                    />
                    <PanelCard
                        header="KAYBEDİLEN"
                        color="red"
                        content={
                            <span className="flex-wrap break-all text-pretty">
                                {projectCounts?.lostCount?.toLocaleString() ||
                                    "0"}
                            </span>
                        }
                        icon={<BiBriefcase />}
                    />
                </div>
            </section>

            <section className="w-full max-w-[1040px]">
                <div className="flex flex-col gap-1 mt-3 md:mt-0">
                    <h1 className="text-2xl font-semibold text-zinc-600">
                        Cihazlar
                    </h1>
                    {/* <p className="text-sm text-zinc-400">
                        Cihazların durumuyla alakalı bilgiler.
                    </p> */}
                </div>

                <Divider className="mt-2 mb-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 md:mt-0">
                    <PanelCard
                        header="STOK"
                        color="sky"
                        content={
                            <span className="flex-wrap break-all text-pretty">
                                {applianceCounts?.stockCount?.toLocaleString() ||
                                    "0"}
                            </span>
                        }
                        icon={<BiServer />}
                    />
                    <PanelCard
                        header="SİPARİŞ"
                        color="yellow"
                        content={
                            <span className="flex-wrap break-all text-pretty">
                                {applianceCounts?.orderCount?.toLocaleString() ||
                                    "0"}
                            </span>
                        }
                        icon={<BiServer />}
                    />
                    <PanelCard
                        header="AKTİF"
                        color="green"
                        content={
                            <span className="flex-wrap break-all text-pretty">
                                {applianceCounts?.activeCount?.toLocaleString() ||
                                    "0"}
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
                    {/* <p className="text-sm text-zinc-400">
                        Lisansların durumuyla alakalı bilgiler.
                    </p> */}
                </div>

                <Divider className="mt-3 mb-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 md:mt-0">
                    <Card className="w-full min-w-72 border-1 border-b-3">
                        <CardBody className="flex flex-col gap-2">
                            <div className="w-full text-center">
                                <h6
                                    className={`text-sm uppercase font-bold text-zinc-700`}
                                >
                                    SİPARİŞLER
                                </h6>
                            </div>

                            <Divider />

                            <div className="flex flex-1 items-center">
                                <Pie
                                    options={{
                                        plugins: {
                                            legend: {
                                                position: "bottom",
                                            },
                                        },
                                    }}
                                    data={{
                                        labels: ["Sipariş", "Bekleyen"],
                                        datasets: [
                                            {
                                                label: "Sipariş Sayısı",
                                                data: [
                                                    Number(
                                                        licenseCounts?.orderCount,
                                                    ),
                                                    Number(
                                                        licenseCounts?.waitingCount,
                                                    ),
                                                ],
                                                backgroundColor: [
                                                    "rgb(250 204 21)",
                                                    "rgb(251 146 60)",
                                                ],
                                                borderWidth: 1,
                                            },
                                        ],
                                    }}
                                />
                            </div>
                        </CardBody>
                    </Card>

                    <div className="flex flex-col gap-4 items-center">
                        <PanelCard
                            header="STOK"
                            color="sky"
                            content={
                                <span className="flex-wrap break-all text-pretty">
                                    {licenseCounts?.stockCount?.toLocaleString() ||
                                        "0"}
                                </span>
                            }
                            icon={<BiShieldPlus />}
                        />
                        <PanelCard
                            header="SİPARİŞ"
                            color="yellow"
                            content={
                                <span className="flex-wrap break-all text-pretty">
                                    {(
                                        (licenseCounts?.waitingCount ?? 0) +
                                        (licenseCounts?.orderCount ?? 0)
                                    )?.toLocaleString() || "0"}
                                </span>
                            }
                            icon={<BiShield />}
                        />
                        <PanelCard
                            header="AKTİF"
                            color="green"
                            content={
                                <span className="flex-wrap break-all text-pretty">
                                    {licenseCounts?.activeCount?.toLocaleString() ||
                                        "0"}
                                </span>
                            }
                            icon={<BiShieldQuarter />}
                            onClick={() => {
                                router.push("/dashboard/licenses");
                            }}
                        />
                    </div>

                    <Card className="w-full min-w-72 border-1 border-b-3">
                        <CardBody className="flex flex-col gap-2">
                            <div className="w-full text-center">
                                <h6 className="text-sm uppercase font-bold text-zinc-700">
                                    SÜRESİ DOLANLAR
                                </h6>
                            </div>

                            <Divider />

                            <div className="flex flex-1 items-center">
                                <Doughnut
                                    options={{
                                        plugins: {
                                            // title: {
                                            //     position: "top",
                                            //     text: "Süresi Dolanlar",
                                            // },
                                            legend: {
                                                position: "bottom",
                                            },
                                        },
                                    }}
                                    data={{
                                        labels: [
                                            "Devam Eden",
                                            "30 Günden Az",
                                            "Biten",
                                        ],
                                        datasets: [
                                            {
                                                label: "Lisans Sayısı",
                                                data: [
                                                    Number(
                                                        licenseCounts?.continuesCount,
                                                    ),
                                                    Number(
                                                        licenseCounts?.endingCount,
                                                    ),
                                                    Number(
                                                        licenseCounts?.endedCount,
                                                    ),
                                                ],
                                                backgroundColor: [
                                                    "rgb(34 197 94)",
                                                    "rgb(250 204 21)",
                                                    "rgb(239 68 68)",
                                                ],
                                                borderWidth: 1,
                                            },
                                        ],
                                    }}
                                />
                            </div>
                        </CardBody>
                    </Card>
                    {/* <PanelCard
                        header="SİPARİŞ"
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
                        header="BEKLEYEN"
                        color="orange"
                        content={
                            <span className="flex-wrap break-all text-pretty">
                                {licenseCounts?.waitingCount?.toLocaleString() ||
                                    "-"}
                            </span>
                        }
                        icon={<BiShieldQuarter />}
                    /> */}
                </div>

                {/* <Divider className="my-4" /> */}

                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 md:mt-0">
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
                </div> */}
            </section>
        </div>
    );
}
