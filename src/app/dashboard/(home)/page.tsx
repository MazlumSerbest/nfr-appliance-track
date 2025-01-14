"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PanelCard from "@/components/PanelCard";

import { Divider } from "@nextui-org/divider";

import {
    BiServer,
    BiShieldPlus,
    BiShieldQuarter,
    BiBriefcase,
    BiShield,
    BiError,
    BiXCircle,
} from "react-icons/bi";
import { Chart } from "react-google-charts";
import Skeleton, { TableSkeleton } from "@/components/loaders/Skeleton";
import {
    getLicenseCounts,
    getApplianceCounts,
    getProjectCounts,
} from "@/lib/prisma";
import { Card, CardBody } from "@nextui-org/react";

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
                        onClick={() =>
                            router.push("/dashboard/projects?tab=projects")
                        }
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
                        onClick={() =>
                            router.push("/dashboard/projects?tab=won")
                        }
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
                        onClick={() =>
                            router.push("/dashboard/projects?tab=lost")
                        }
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
                        onClick={() =>
                            router.push("/dashboard/appliances?tab=stock")
                        }
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
                        onClick={() =>
                            router.push("/dashboard/appliances?tab=order")
                        }
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
                        onClick={() =>
                            router.push("/dashboard/appliances?tab=active")
                        }
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
                            onClick={() =>
                                router.push("/dashboard/licenses?tab=stock")
                            }
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
                            onClick={() =>
                                router.push("/dashboard/licenses?tab=active")
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-4 items-center">
                        <PanelCard
                            header="SİPARİŞ"
                            color="yellow"
                            content={
                                <span className="flex-wrap break-all text-pretty">
                                    {licenseCounts?.orderCount?.toLocaleString() ||
                                        "0"}
                                </span>
                            }
                            icon={<BiShield />}
                            onClick={() =>
                                router.push("/dashboard/licenses?tab=order")
                            }
                        />
                        <PanelCard
                            header="BEKLEYEN SİPARİŞ"
                            color="orange"
                            content={
                                <span className="flex-wrap break-all text-pretty">
                                    {licenseCounts?.waitingCount?.toLocaleString() ||
                                        "0"}
                                </span>
                            }
                            icon={<BiShield />}
                            onClick={() =>
                                router.push(
                                    "/dashboard/licenses?tab=waitingOrder",
                                )
                            }
                        />
                    </div>

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
                                <Chart
                                    chartType="PieChart"
                                    width="100%"
                                    height={300}
                                    data={[
                                        ["Durum", "Lisans Sayısı"],
                                        [
                                            "Sipariş",
                                            Number(licenseCounts?.orderCount),
                                        ],
                                        [
                                            "Bekleyen",
                                            Number(licenseCounts?.waitingCount),
                                        ],
                                    ]}
                                    options={{
                                        // is3D: true,
                                        // title: "Siparişler",
                                        fontSize: 12,
                                        colors: [
                                            "rgb(250, 204, 21)",
                                            "rgb(251, 146, 60)",
                                        ],
                                        chartArea: {
                                            top: 12,
                                            width: "100%",
                                            height: 250,
                                        },
                                        legend: {
                                            position: "bottom",
                                            alignment: "center",
                                            maxLines: 2,
                                            textStyle: {
                                                color: "gray",
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="col-span-3 xl:col-span-2 w-full min-w-72 border-1 border-b-3">
                        <CardBody className="flex flex-col gap-2 place-items-center">
                            <div className="w-full text-center">
                                <h6 className="text-sm uppercase font-bold text-zinc-700">
                                    SÜRESİ DOLANLAR (AKTİF LİSANSLAR)
                                </h6>
                            </div>

                            <Divider />

                            <div className="flex flex-1 items-center py-2">
                                <Chart
                                    chartType="BarChart"
                                    data={[
                                        [
                                            "Süre",
                                            "Lisans Sayısı",
                                            { role: "style" },
                                            { role: "annotation" },
                                        ],
                                        [
                                            "Süresi Dolan",
                                            Number(licenseCounts?.endedCount),
                                            "rgb(239, 68, 68)",
                                            Number(licenseCounts?.endedCount),
                                        ],
                                        [
                                            "30 Günden Az",
                                            Number(licenseCounts?.endingCount),
                                            "rgb(250, 204, 21)",
                                            Number(licenseCounts?.endingCount),
                                        ],
                                        [
                                            "Devam Eden",
                                            Number(
                                                licenseCounts?.continuesCount,
                                            ),
                                            "rgb(34, 197, 94)",
                                            Number(
                                                licenseCounts?.continuesCount,
                                            ),
                                        ],
                                    ]}
                                    options={{
                                        isStacked: true,
                                        width: 600,
                                        height: 300,
                                        fontSize: 12,
                                        bar: { groupWidth: "75%" },
                                        chartArea: {
                                            top: 20,
                                            width: "80%",
                                            height: "80%",
                                        },
                                        hAxis: {
                                            title: "Lisans Sayısı",
                                            titleTextStyle: {
                                                color: "gray",
                                            },
                                            textStyle: { color: "gray" },
                                            baselineColor: "gray",
                                        },
                                        vAxis: {
                                            textStyle: { color: "gray" },
                                        },
                                        legend: {
                                            position: "none",
                                            alignment: "center",
                                            maxLines: 3,
                                            textStyle: {
                                                color: "gray",
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </CardBody>
                    </Card>

                    <div className="flex flex-col gap-4 items-center">
                        <div className="w-full basis-1/2">
                            <PanelCard
                                header="KAYIP"
                                color="red"
                                content={
                                    <span className="flex-wrap break-all text-pretty">
                                        {licenseCounts?.lostCount?.toLocaleString() ||
                                            "0"}
                                    </span>
                                }
                                icon={<BiError />}
                                onClick={() =>
                                    router.push("/dashboard/licenses?tab=lost")
                                }
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
