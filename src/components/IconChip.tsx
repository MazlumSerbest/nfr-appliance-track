import { Tooltip } from "@nextui-org/tooltip";
import { ReactNode } from "react";

type Props = {
    icon: ReactNode;
    color: string;
    content: string;
};

export default function IconChip(props: Props) {
    return (
        <div className="w-full">
            <Tooltip key={props.content} content={props.content}>
                <div
                    className={
                        `flex items-center p-1 rounded-full w-min ${props.color}`
                    }
                >
                    {props.icon}
                </div>
            </Tooltip>
        </div>
    );
}
