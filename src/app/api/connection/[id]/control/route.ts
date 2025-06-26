import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function POST(
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

        const control: ControlHistory = await request.json();
        control.connectionId = Number(params.id);

        const newConnection = await prisma.connectionControlHistory.create({
            data: control,
        });

        if (!newConnection.id)
            return NextResponse.json({
                message: "Gözetim kaydedilemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "create",
                table: "connectionControlHistory",
                user: newConnection.createdBy,
                date: new Date().toISOString(),
                description: `Control created: ${newConnection.id}`,
                data: JSON.stringify(newConnection),
            },
        });

        return NextResponse.json({
            message: "Gözetim başarıyla kaydedildi!",
            status: 200,
            ok: true,
        });
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

        const connection: any = {
            controlled:
                request.nextUrl.searchParams.get("controlled") === "true"
                    ? true
                    : false,
            updatedAt: new Date().toISOString(),
            updatedBy: session.user?.email || "",
        };

        const updatedConnection = await prisma.connections.update({
            where: { id: Number(params.id) },
            data: connection,
        });

        if (!updatedConnection.id)
            return NextResponse.json({
                message: "Bağlantı güncellenemedi!",
                status: 400,
                ok: false,
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
