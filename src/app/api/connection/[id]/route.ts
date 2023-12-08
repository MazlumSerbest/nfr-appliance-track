import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const data = await prisma.connections.findFirst({
            where: {
                id: Number(params.id),
            },
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const connection: Connection = await request.json();
        connection.updatedAt = new Date().toISOString();
        const data = await prisma.connections.update({
            where: {
                id: Number(params.id),
            },
            data: connection,
        });

        return NextResponse.json(
            {
                message: "Bağlantı başarıyla güncellendi!",
            },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const connection: Connection = await request.json();
        connection.updatedAt = new Date().toISOString();
        const data = await prisma.connections.update({
            where: {
                id: Number(params.id),
            },
            data: connection,
        });

        return NextResponse.json(
            {
                message: "Bağlantı silindi!",
            },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
