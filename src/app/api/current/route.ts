import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";
import { currentTypes } from "@/lib/constants";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session)
            return NextResponse.json({
                message: "Authorization Needed!",
                status: 401,
                ok: false,
            });

        const currentType: any =
            request.nextUrl.searchParams.get("currentType");

        const data = await prisma.currents.findMany({
            where: {
                type: currentType,
            },
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

        const current: Current = await request.json();
        const currType = current.type;

        const newCurrent = await prisma.currents.create({
            data: current,
        });

        if (!newCurrent.id)
            return NextResponse.json({
                message: `${
                    currentTypes.find((e) => e.key == currType)?.name
                } kaydedilemedi!`,
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "create",
                table: "currents",
                user: newCurrent.createdBy,
                date: new Date().toISOString(),
                description: `Current created: ${newCurrent.id}`,
                data: JSON.stringify(newCurrent),
            },
        });

        return NextResponse.json({
            message: `${
                currentTypes.find((e) => e.key == currType)?.name
            } başarıyla kaydedildi!`,
            status: 200,
            ok: true,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
