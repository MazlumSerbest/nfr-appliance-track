import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function GET(request: Request) {
    try {
        const session = await getServerSession();

        if (session) {
            const data = await prisma.connections.findMany({
                include: {
                    customer: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: [
                    {
                        createdAt: "desc",
                    },
                ],
            });

            return NextResponse.json(data);
        }

        return NextResponse.json({
            message: "Authorization Needed!",
            status: 401,
            ok: false,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession();

        if (session) {
            const connection: Connection = await request.json();

            const newConnection = await prisma.connections.create({
                data: connection,
            });

            if (newConnection.id) {
                return NextResponse.json({
                    message: "Bağlantı başarıyla kaydedildi!",
                    status: 200,
                    ok: true,
                });
            } else {
                return NextResponse.json({
                    message: "Bağlantı kaydedilemedi!",
                    status: 400,
                    ok: false,
                });
            }
        }

        return NextResponse.json({
            message: "Authorization Needed!",
            status: 401,
            ok: false,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
