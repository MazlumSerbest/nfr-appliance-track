import Image from "next/image";
import { BiLoaderAlt } from "react-icons/bi";

export default function Loader() {
    return (
        <div className="flex w-full h-full items-center justify-center">
            <BiLoaderAlt className="animate-spin text-5xl text-zinc-400" />
        </div>
    );
}

export function MainLoader() {
    return (
        <div className="flex animate-pulse w-screen h-screen items-center justify-center bg-white rounded-full">
            <Image
                src="/images/logo.png"
                width={544}
                height={180}
                alt="Company"
            />
        </div>
    );
}
