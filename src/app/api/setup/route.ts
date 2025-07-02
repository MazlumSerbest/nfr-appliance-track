import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function GET() {
    try {
        const session = await getServerSession();

        if (!session)
            return NextResponse.json({
                message: "Authorization Needed!",
                status: 401,
                ok: false,
            });

        const data = await prisma.vSetups.findMany({
            orderBy: [
                {
                    createdAt: "desc",
                },
            ],
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session)
            return NextResponse.json({
                message: "Authorization Needed!",
                status: 401,
                ok: false,
            });

        const setup: Setup = await request.json();

        const newSetup = await prisma.setups.create({
            data: setup,
        });

        if (!newSetup.id)
            return NextResponse.json({
                message: "Kurulum kaydedilemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "create",
                table: "setups",
                user: newSetup.createdBy,
                date: new Date().toISOString(),
                description: `Setup created: ${newSetup.id}`,
                data: JSON.stringify(newSetup),
            },
        });

        return NextResponse.json({
            message: "Kurulum başarıyla kaydedildi!",
            status: 200,
            ok: true,
            id: newSetup.id,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
