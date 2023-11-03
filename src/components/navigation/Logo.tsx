import Image from "next/image";

interface Props {
    width: number;
    height: number;
}

export default function Logo(props: Props) {
    return (
        <div className="flex justify-center">
            <Image src="/images/vercel.svg" width={props.width} height={props.height} alt="Company Logo" />
        </div>
    );
}
