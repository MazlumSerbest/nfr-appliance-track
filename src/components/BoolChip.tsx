import { BiCheckCircle, BiXCircle } from "react-icons/bi";

type Props = {
    value: boolean;
    showText?: boolean;
};

export default function BoolChip({ value, showText = false }: Props) {
    return (
        <div className="w-full">
            <div
                className={
                    "flex items-center " +
                    (value ? "bg-green-100" : "bg-red-100") +
                    "  p-1 rounded-full w-min"
                }
            >
                {value ? (
                    <BiCheckCircle className="text-xl text-green-600" />
                ) : (
                    <BiXCircle className="text-xl text-red-600" />
                )}
                {showText ? (
                    <p
                        className={
                            (value ? "text-green-600" : "text-red-600") +
                            " mx-1"
                        }
                    >
                        {value == true ? "Yes" : "No"}
                    </p>
                ) : null}
            </div>
        </div>
    );
}
