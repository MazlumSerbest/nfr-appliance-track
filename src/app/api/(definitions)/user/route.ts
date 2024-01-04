import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";
import bcrypt from "bcrypt";

export async function GET(request: Request) {
    try {
        const session = await getServerSession();

        if (session) {
            const data = await prisma.users.findMany({
                select: {
                    id: true,
                    username: true,
                    name: true,
                    email: true,
                    role: true,
                    active: true,
                },
            });

            return NextResponse.json(data);
        }

        return NextResponse.json({
            message: "Authorization Needed!",
            status: 401,
        });
    } catch (error) {
        return NextResponse.json({ message: error });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession();

        if (session) {
            const user = await request.json();

            const checkUsername = await prisma.users.findUnique({
                where: {
                    username: user.username,
                },
                select: {
                    username: true,
                },
            });
            if (checkUsername)
                return NextResponse.json(
                    {
                        message: "This username already used for another user!",
                    },
                    { status: 400 },
                );

            const checkEmail = await prisma.users.findUnique({
                where: {
                    email: user.email,
                },
                select: {
                    email: true,
                },
            });
            if (checkEmail)
                return NextResponse.json(
                    {
                        message: "This email already used for another user!",
                    },
                    { status: 400 },
                );

            bcrypt.hash(
                user.password,
                10,
                async function (err: Error | undefined, hash: string) {
                    if (!err) {
                        user.password = hash;

                        const newUser = await prisma.users.create({
                            data: user,
                        });

                        if (newUser.id) {
                            return NextResponse.json({
                                message: "User created successfully!",
                            });
                        } else {
                            return NextResponse.json({
                                message: "User didn't created!",
                            });
                        }
                    } else {
                        return NextResponse.json({ message: err });
                    }
                },
            );
        }

        return NextResponse.json({
            message: "Authorization Needed!",
            status: 401,
        });
    } catch (err) {
        return NextResponse.json({ message: err });
    }
}
