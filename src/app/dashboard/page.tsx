import PanelCard from "@/components/PanelCard";
import { BiDesktop, BiShield, BiData } from "react-icons/bi";

export default function Dashboard() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mt-4 md:mt-0">
            <PanelCard
                header="Total Machines"
                content={
                    <h1 className="font-bold text-7xl text-zinc-500">20</h1>
                }
                icon={
                    <BiDesktop className="text-5xl md:text-6xl text-zinc-400/50" />
                }
            />
            <PanelCard
                header="Total License"
                content={
                    <h1 className="font-bold text-7xl text-zinc-500">150</h1>
                }
                icon={
                    <BiShield className="text-5xl md:text-6xl text-zinc-400/50" />
                }
            />
            <PanelCard
                header="Total Location"
                content={
                    <h1 className="font-bold text-7xl text-zinc-500">58</h1>
                }
                icon={
                    <BiData className="text-5xl md:text-6xl text-zinc-400/50" />
                }
            />
        </div>
    );
}
