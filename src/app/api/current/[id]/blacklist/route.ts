import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

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

        const current: any = {
            blacklisted:
                request.nextUrl.searchParams.get("blacklisted") === "true"
                    ? true
                    : false,
            updatedAt: new Date().toISOString(),
            updatedBy: session.user?.email || "",
        };

        const updatedCurrent = await prisma.currents.update({
            where: { id: Number(params.id) },
            data: current,
        });

        if (!updatedCurrent.id)
            return NextResponse.json({
                message: "Cari güncellenemedi!",
                status: 400,
                ok: false,
            });

        return NextResponse.json({
            message: "Cari başarıyla güncellendi!",
            status: 200,
            ok: true,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
