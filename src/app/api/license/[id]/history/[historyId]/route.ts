import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function PUT(
    request: Request,
    { params }: { params: { id: string, historyId: string } },
) {
    try {
        const session = await getServerSession();

        if (session) {
            const licenseHistory = await request.json();
            licenseHistory.updatedAt = new Date().toISOString();
            licenseHistory.startDate = licenseHistory.startDate
                ? new Date(licenseHistory.startDate).toISOString()
                : null;
            licenseHistory.expiryDate = licenseHistory.expiryDate
                ? new Date(licenseHistory.expiryDate).toISOString()
                : null;

            const updatedLicenseHistory = await prisma.licenseHistory.update({
                data: licenseHistory,
                where: {
                    id: Number(params.historyId),
                },
            });

            if (updatedLicenseHistory.id) {
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
            } else {
                return NextResponse.json({
                    message: "Lisans geçmişi güncellenemedi!",
                    status: 400,
                    ok: false,
                });
            }
        }

        return NextResponse.json({
            message: "Authorization Needed!",
            status: 401,
            ok: false,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
