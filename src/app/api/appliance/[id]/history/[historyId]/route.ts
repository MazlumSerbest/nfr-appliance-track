import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string; historyId: string } },
) {
    try {
        const session = await getServerSession();

        if (!session)
            return NextResponse.json({
                message: "Authorization Needed!",
                status: 401,
                ok: false,
            });

        const applianceHistory = await request.json();
        applianceHistory.updatedAt = new Date().toISOString();
        applianceHistory.boughtAt = applianceHistory.boughtAt
            ? new Date(applianceHistory.boughtAt).toISOString()
            : null;
        applianceHistory.soldAt = applianceHistory.soldAt
            ? new Date(applianceHistory.soldAt).toISOString()
            : null;

        const updatedApplianceHistory = await prisma.applianceHistory.update({
            data: applianceHistory,
            where: {
                id: Number(params.historyId),
            },
        });

        if (!updatedApplianceHistory.id)
            return NextResponse.json({
                message: "Cihaz müşteri geçmişi güncellenemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "update",
                table: "appliancesHistory",
                user: updatedApplianceHistory.updatedBy || "",
                date: new Date().toISOString(),
                description: `Appliance history updated: ${updatedApplianceHistory.id}`,
                data: JSON.stringify(updatedApplianceHistory),
            },
        });

        return NextResponse.json({
            message: "Cihaz müşteri geçmişi başarıyla güncellendi!",
            status: 200,
            ok: true,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
