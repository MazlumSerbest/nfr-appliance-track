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

        const current = await prisma.currents.findUnique({
            where: {
                id: Number(params.id),
            },
            select: {
                paymentPlan: true,
            },
        });

        if (!current)
            return NextResponse.json({
                message: "Cari bulunamadı!",
                status: 400,
                ok: false,
            });

        return NextResponse.json(current.paymentPlan);
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
