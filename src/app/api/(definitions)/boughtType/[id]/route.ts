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

        const data = await prisma.boughtTypes.findUnique({
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

        const boughtType: BoughtType = await request.json();
        boughtType.updatedAt = new Date().toISOString();

        const updatedBoughtType = await prisma.boughtTypes.update({
            where: {
                id: Number(params.id),
            },
            data: boughtType,
        });

        if (!updatedBoughtType.id)
            return NextResponse.json({
                message: "Alım tipi güncellenemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "update",
                table: "boughtTypes",
                user: updatedBoughtType.updatedBy || "",
                date: new Date().toISOString(),
                description: `Bought type updated: ${updatedBoughtType.id}`,
                data: JSON.stringify(updatedBoughtType),
            },
        });

        return NextResponse.json({
            message: "Alım tipi başarıyla güncellendi!",
            status: 200,
            ok: true,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
