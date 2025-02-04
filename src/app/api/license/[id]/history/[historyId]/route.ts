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

        const licenseHistory = await request.json();
        licenseHistory.updatedAt = new Date().toISOString();
        licenseHistory.startDate =
            licenseHistory.startDate &&
            new Date(licenseHistory.startDate).toISOString();
        licenseHistory.expiryDate =
            licenseHistory.expiryDate &&
            new Date(licenseHistory.expiryDate).toISOString();
        licenseHistory.boughtAt =
            (licenseHistory.boughtAt &&
                new Date(licenseHistory.boughtAt).toISOString()) ||
            null;
        licenseHistory.soldAt =
            (licenseHistory.soldAt &&
                new Date(licenseHistory.soldAt).toISOString()) ||
            null;
        licenseHistory.orderedAt =
            (licenseHistory.orderedAt &&
                new Date(licenseHistory.orderedAt).toISOString()) ||
            null;

        const updatedLicenseHistory = await prisma.licenseHistory.update({
            data: licenseHistory,
            where: {
                id: Number(params.historyId),
            },
        });

        if (!updatedLicenseHistory.id)
            return NextResponse.json({
                message: "Lisans geçmişi güncellenemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "update",
                table: "licenseHistory",
                user: updatedLicenseHistory.updatedBy || "",
                date: new Date().toISOString(),
                description: `License history updated: ${updatedLicenseHistory.id}`,
                data: JSON.stringify(updatedLicenseHistory),
            },
        });

        return NextResponse.json({
            message: "Lisans geçmişi başarıyla güncellendi!",
            status: 200,
            ok: true,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
