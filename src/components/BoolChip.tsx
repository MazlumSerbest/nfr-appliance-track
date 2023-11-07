import { BiCheckCircle, BiXCircle } from "react-icons/bi";

interface Props {
    value: boolean;
    showText?: boolean;
}

export default function BoolChip(props: Props) {
    return (
        <div className="w-full">
            <div
                className={
                    "flex items-center " +
                    (props.value ? "bg-green-100" : "bg-red-100") +
                    "  p-1 rounded-full w-min"
                }
            >
                {props.value ? (
                    <BiCheckCircle className="text-xl text-green-600" />
                ) : (
                    <BiXCircle className="text-xl text-red-500" />
                )}
                {props.showText ? (
                    <p
                        className={
                            (props.value ? "text-green-600" : "text-red-500") +
                            " mx-1"
                        }
                    >
                        {props.value == true ? "Yes" : "No"}
                    </p>
                ) : null}
            </div>
        </div>
    );
}
