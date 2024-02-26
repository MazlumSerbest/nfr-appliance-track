import { Tooltip } from "@nextui-org/tooltip";
import { ReactNode } from "react";

type Props = {
    icon: ReactNode;
    color: string;
    content: string;
};

export default function IconChip(props: Props) {
    const { icon, color, content } = props;

    return (
        <div className="w-full">
            <Tooltip key={content} content={content}>
                <div
                    className={
                        `flex items-center p-1 rounded-full w-min ${color}`
                    }
                >
                    {icon}
                </div>
            </Tooltip>
        </div>
    );
}
