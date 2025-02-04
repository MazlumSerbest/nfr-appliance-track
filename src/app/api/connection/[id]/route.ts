import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getServerSession();

        if (!session)
            return NextResponse.json({
                message: "Authorization Needed!",
                status: 401,
                ok: false,
            });

        const data = await prisma.connections.findUnique({
            where: {
                id: Number(params.id),
            },
            include: {
                controlHistory: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getServerSession();

        if (!session)
            return NextResponse.json({
                message: "Authorization Needed!",
                status: 401,
                ok: false,
            });

        const connection: Connection = await request.json();
        connection.updatedAt = new Date().toISOString();

        const updatedConnection = await prisma.connections.update({
            where: {
                id: Number(params.id),
            },
            data: connection,
        });

        if (!updatedConnection.id)
            return NextResponse.json({
                message: "Bağlantı güncellenemedi!",
                status: 400,
                ok: false,
            });

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
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
