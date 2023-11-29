import Image from "next/image";

type Props = {
    width: number;
    height: number;
}

export default function Logo(props: Props) {
    return (
        <div className="flex justify-center">
            <Image src="/images/logo.png" width={props.width} height={props.height} alt="NFR Bilgi & Güvenlik" />
        </div>
    );
}
