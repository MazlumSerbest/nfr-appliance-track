import { BiLoaderAlt } from "react-icons/bi";
import Logo from "../navigation/Logo";

export default function Loader() {
    return (
        <div className="flex w-full h-full items-center justify-center">
            <BiLoaderAlt className="animate-spin text-5xl text-sky-400" />
        </div>
    );
}

export function MainLoader() {
    return (
        <div className="flex animate-pulse w-screen h-screen items-center justify-center bg-white rounded-full">
            <Logo
                width={280}
                height={150}
            />
        </div>
    );
}
