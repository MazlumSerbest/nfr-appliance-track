import Image from "next/image";

type Props = {
    width: number;
    height: number;
};

export default function Logo({ width, height }: Props) {
    return (
        <div className="flex justify-center">
            <Image
                src="/images/logo.png"
                width={width}
                height={height}
                alt="NFR Bilgi & Güvenlik"
            />
        </div>
    );
}
