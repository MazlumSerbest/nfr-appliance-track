import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function GET(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getServerSession();

        if (session) {
            const data = await prisma.connections.findUnique({
                where: {
                    id: Number(params.id),
                },
                include: {
                    customer: {
                        select: {
                            name: true,
                        },
                    },
                },
            });

            return NextResponse.json(data);
        }

        return NextResponse.json({
            message: "Authorization Needed!",
            status: 401,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getServerSession();

        if (session) {
            const connection: Connection = await request.json();
            connection.updatedAt = new Date().toISOString();

            const updateConnection = await prisma.connections.update({
                where: {
                    id: Number(params.id),
                },
                data: connection,
            });

            if (updateConnection.id) {
                return NextResponse.json({
                    message: "Bağlantı başarıyla güncellendi!",
                    status: 200,
                });
            } else {
                return NextResponse.json({
                    message: "Bağlantı güncellenemedi!",
                    status: 400,
                });
            }
        }

        return NextResponse.json({
            message: "Authorization Needed!",
            status: 401,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500 });
    }
}
