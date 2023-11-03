import PanelCard from "@/components/PanelCard";
import { CircularProgress, Progress } from "@nextui-org/progress";
import { Card, CardBody } from "@nextui-org/card";
import { BiServer, BiShield, BiData } from "react-icons/bi";

export default function Dashboard() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mt-4 md:mt-0">
            <PanelCard
                header="STOK CİHAZ SAYISI"
                content={
                    <h1 className="font-bold text-7xl text-zinc-500">20</h1>
                }
                icon={
                    <BiServer className="text-5xl md:text-6xl text-sky-400/50" />
                }
            />
            <PanelCard
                header="LİSANS SAYISI"
                content={
                    <h1 className="font-bold text-7xl text-zinc-500">150</h1>
                }
                icon={
                    <BiShield className="text-5xl md:text-6xl text-sky-400/50" />
                }
            />
            <PanelCard
                header="LİSANS SAYISI"
                content={
                    <h1 className="font-bold text-7xl text-zinc-500">150</h1>
                }
                icon={
                    <BiShield className="text-5xl md:text-6xl text-sky-400/50" />
                }
            />
            <PanelCard
                header="AKTİF CİHAZ SAYISI"
                content={
                    <CircularProgress
                        value={120}
                        maxValue={500}
                        showValueLabel={true}
                        size="lg"
                        strokeWidth={10}
                        // formatOptions={{
                        //     style: "unit",
                        // }}
                        classNames={{
                            svg: "w-32 h-32 drop-shadow-md",
                            indicator: "text-green-400",
                            value: "text-2xl font-semibold text-green-400",
                        }}
                    />
                }
            />
            <Card className="col-span-1 md:col-span-2 border-b-4 border-zinc-300">
                <CardBody className="gap-2 justify-around">
                    <Progress
                        label="Toplam"
                        showValueLabel={true}
                        value={90}
                        classNames={{
                            label: "text-zinc-500 font-semibold",
                            indicator: "bg-blue-400",
                            value: "text-zinc-500",
                        }}
                    />
                    <Progress
                        label="Biten Lisans Sayısı"
                        showValueLabel={true}
                        value={500}
                        maxValue={5000}
                        formatOptions={{
                            style: "decimal",
                        }}
                        classNames={{
                            label: "text-zinc-500 font-semibold",
                            indicator: "bg-red-400",
                            value: "text-zinc-500",
                        }}
                    />
                </CardBody>
            </Card>
        </div>
    );
}
