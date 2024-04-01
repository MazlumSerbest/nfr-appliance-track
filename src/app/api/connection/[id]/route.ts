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
                // include: {
                //     customer: {
                //         select: {
                //             name: true,
                //         },
                //     },
                //     brand: {
                //         select: {
                //             name: true,
                //         },
                //     },
                // },
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

export async function PUT(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getServerSession();

        if (session) {
            const connection: Connection = await request.json();
            connection.updatedAt = new Date().toISOString();

            const updatedConnection = await prisma.connections.update({
                where: {
                    id: Number(params.id),
                },
                data: connection,
            });

            if (updatedConnection.id) {
                await prisma.logs.create({
                    data: {
                        action: "update",
                        table: "connections",
                        user: updatedConnection.updatedBy || "",
                        date: new Date().toISOString(),
                        description: `Connection updated: ${updatedConnection.id}`,
                        data: JSON.stringify(updatedConnection),
                    },
                });

                return NextResponse.json({
                    message: "Bağlantı başarıyla güncellendi!",
                    status: 200,
                    ok: true,
                });
            } else {
                return NextResponse.json({
                    message: "Bağlantı güncellenemedi!",
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
