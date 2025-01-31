import { Tooltip } from "@heroui/tooltip";
import { ReactNode } from "react";

type Props = {
    icon: ReactNode;
    color: string;
    content: string;
};

export default function IconChip({ icon, color, content }: Props) {
    return (
        <div className="w-full">
            <Tooltip key={content} content={content}>
                <div
                    className={`flex items-center p-1 rounded-full w-min ${color}`}
                >
                    {icon}
                </div>
            </Tooltip>
        </div>
    );
}
