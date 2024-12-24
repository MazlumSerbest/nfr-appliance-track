import { Card, CardBody } from "@nextui-org/card";
import { on } from "events";

type Props = {
    content: React.ReactNode;
    header?: string;
    icon?: React.ReactNode;
    color?: string;
    onClick?: () => void;
};

type ColorSet = {
    name: string;
    border: string;
    icon: string;
    text: string;
};

export default function PanelCard(props: Props) {
    const { content, header, icon, color, onClick } = props;

    const colors: ColorSet[] = [
        {
            name: "sky",
            border: "border-sky-400/50",
            icon: "text-sky-400/50",
            text: "text-sky-400",
        },
        {
            name: "green",
            border: "border-green-400/50",
            icon: "text-green-400/50",
            text: "text-green-400",
        },
        {
            name: "red",
            border: "border-red-400/50",
            icon: "text-red-400/50",
            text: "text-red-400",
        },
        {
            name: "yellow",
            border: "border-yellow-400/50",
            icon: "text-yellow-400/50",
            text: "text-yellow-400",
        },
        {
            name: "orange",
            border: "border-orange-400/50",
            icon: "text-orange-400/50",
            text: "text-orange-400",
        },
        {
            name: "indigo",
            border: "border-indigo-400/50",
            icon: "text-indigo-400/50",
            text: "text-indigo-400",
        },
    ];

    return (
        <Card
            className={`w-full h-full min-w-72 border-1 border-b-3 ${
                colors.find((c) => c.name == color)?.border
            } ${onClick ? "cursor-pointer active:bg-gray-100" : ""}`}
            // className={
            //     "min-w-72 max-w-80" +
            //     (onClick ? "cursor-pointer active:bg-gray-100" : "")
            // }
        >
            <CardBody
                className="flex flex-row p-6 pt-4 items-center overflow-hidden"
                onClick={onClick}
            >
                {icon && (
                    <div
                        className={`text-5xl md:text-5xl ${
                            colors.find((c) => c.name == color)?.icon
                        }`}
                    >
                        {icon}
                    </div>
                )}
                <div className="flex flex-col flex-1 gap-2 items-center">
                    {header && (
                        <h6
                            className={`text-sm uppercase font-bold ${
                                colors.find((c) => c.name == color)?.text
                            }`}
                        >
                            {header}
                        </h6>
                    )}
                    <div className="flex flex-1 items-center font-bold text-6xl text-zinc-500 break-words px-2">
                        {content}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
