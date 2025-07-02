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

        const data = await prisma.vSetups.findUnique({
            where: {
                id: Number(params.id),
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

        const setup: Setup = await request.json();
        setup.updatedAt = new Date().toISOString();
        setup.completedAt = setup.completedAt
            ? new Date(setup.completedAt).toISOString()
            : null;

        const updatedSetup = await prisma.setups.update({
            where: {
                id: Number(params.id),
            },
            data: setup,
        });

        if (!updatedSetup.id)
            return NextResponse.json({
                message: "Kurulum güncellenemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "update",
                table: "setups",
                user: updatedSetup.updatedBy || "",
                date: new Date().toISOString(),
                description: `Setup updated: ${updatedSetup.id}`,
                data: JSON.stringify(updatedSetup),
            },
        });

        return NextResponse.json({
            message: "Kurulum başarıyla güncellendi!",
            status: 200,
            ok: true,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
