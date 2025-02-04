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

        const license = await request.json();
        license.updatedAt = new Date().toISOString();
        license.startDate =
            license.startDate && new Date(license.startDate).toISOString();
        license.expiryDate =
            license.expiryDate && new Date(license.expiryDate).toISOString();
        license.boughtAt =
            (license.boughtAt && new Date(license.boughtAt).toISOString()) ||
            null;
        license.soldAt =
            (license.soldAt && new Date(license.soldAt).toISOString()) || null;
        license.orderedAt =
            (license.orderedAt && new Date(license.orderedAt).toISOString()) ||
            null;

        const updatedLicense = await prisma.licenses.update({
            data: {
                ...license,
                history: {
                    createMany: {
                        data: [
                            {
                                serialNo: license.history.serialNo,
                                startDate: new Date(
                                    license.history.startDate,
                                ).toISOString(),
                                expiryDate: new Date(
                                    license.history.expiryDate,
                                ).toISOString(),
                                licenseTypeId: license.history.licenseTypeId,
                                boughtTypeId: license.history.boughtTypeId,
                                dealerId: license.history.dealerId,
                                subDealerId: license.history.subDealerId,
                                supplierId: license.history.supplierId,
                                createdBy: license.updatedBy,
                                createdAt: new Date().toISOString(),
                                boughtAt:
                                    (license.history.boughtAt &&
                                        new Date(
                                            license.history.boughtAt,
                                        ).toISOString()) ||
                                    null,
                                soldAt:
                                    (license.history.soldAt &&
                                        new Date(
                                            license.history.soldAt,
                                        ).toISOString()) ||
                                    null,
                                orderedAt:
                                    (license.history.orderedAt &&
                                        new Date(
                                            license.history.orderedAt,
                                        ).toISOString()) ||
                                    null,
                                applianceId: license.history.applianceId,
                                appSerialNo: license.history.appSerialNo,
                                productId: license.history.productId,
                                note: license.history.note,
                            },
                        ],
                    },
                },
            },
            where: {
                id: Number(params.id),
            },
            include: {
                history: true,
            },
        });

        if (!updatedLicense.id)
            return NextResponse.json({
                message: "Lisans geçmişi güncellenemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "create",
                table: "licenseHistory",
                user: updatedLicense.updatedBy || "",
                date: new Date().toISOString(),
                description: `License history added: ${updatedLicense.id}`,
                data: JSON.stringify(updatedLicense),
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
