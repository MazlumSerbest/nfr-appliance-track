import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import NextLink from "next/link";

import { useDisclosure } from "@nextui-org/react";
import { Avatar, AvatarIcon } from "@nextui-org/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Button } from "@nextui-org/button";

import { BiLogOut } from "react-icons/bi";
import useUserStore from "@/store/user";

export default function UserCard() {
    const { isOpen, onClose, onOpenChange } = useDisclosure();
    const { data: session } = useSession();
    const { user, updateUser } = useUserStore();

    useEffect(() => {
        if (session?.user) {
            fetch(`/api/user/${session?.user?.email ?? ""}`)
                .then((res) => res.json())
                .then((data) => {
                    const currUser: User = {
                        id: data?.id,
                        active: data?.active,
                        username: data?.username,
                        name: data?.name,
                        email: data?.email,
                        role: data?.role,
                        createdBy: data?.createdBy,
                        createdAt: data?.createdAt,
                        updatedBy: data?.updatedBy,
                        updatedAt: data?.updatedAt,
                    };

                    updateUser(currUser);
                });
        }
    }, [session?.user, updateUser]);

    return (
        <>
            {user ? (
                <div className="flex gap-2 items-center">
                    <NextLink className="group flex-1 flex gap-2 items-center" href={"/dashboard/settings"}>
                        <Avatar
                            icon={<AvatarIcon />}
                            classNames={{
                                base: "bg-sky-200",
                                icon: "text-sky-400",
                            }}
                        />
                        <div className="flex-1 min-w-0 hover:">
                            <p className="truncate text-sm font-bold text-sky-500 group-hover:underline">
                                {user?.name ?? user?.username}
                            </p>
                            <p className="truncate text-xs text-zinc-500">
                                {user?.email}
                            </p>
                        </div>
                    </NextLink>
                    <Popover
                        placement="top"
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        backdrop="opaque"
                    >
                        <PopoverTrigger>
                            <Button
                                isIconOnly
                                variant="light"
                                className="p-1 pl-0"
                            >
                                <BiLogOut className="text-2xl text-zinc-500" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="flex flex-col gap-2 p-3">
                            <h2 className="text-lg font-semibold text-zinc-600">
                                Çıkış Yap
                            </h2>
                            <p className="text-sm text-zinc-500 pb-2">
                                Çıkış yapmak istediğinizden emin misiniz?
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="bordered"
                                    color="default"
                                    onPress={onClose}
                                >
                                    Kapat
                                </Button>
                                <Button
                                    variant="solid"
                                    color="danger"
                                    className="bg-red-600"
                                    onClick={() => signOut()}
                                >
                                    Çıkış Yap
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            ) : (
                <div className="animate-pulse flex gap-2 items-center">
                    <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                    <div className="flex-1 flex flex-col min-w-0 gap-1">
                        <div className="h-4 bg-slate-200 rounded"></div>
                        <div className="h-3 bg-slate-200 rounded"></div>
                    </div>
                    <div className="rounded bg-slate-200 size-8"></div>
                </div>
            )}
        </>
    );
}
