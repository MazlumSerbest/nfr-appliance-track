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

        const appliance = await request.json();
        appliance.updatedAt = new Date().toISOString();
        appliance.boughtAt = appliance.boughtAt
            ? new Date(appliance.boughtAt).toISOString()
            : null;
        appliance.soldAt = appliance.soldAt
            ? new Date(appliance.soldAt).toISOString()
            : null;

        const updatedAppliance = await prisma.appliances.update({
            data: {
                ...appliance,
                history: {
                    createMany: {
                        data: [
                            {
                                customerId: appliance.history.customerId,
                                cusName: appliance.history.cusName,
                                boughtAt: appliance.history.boughtAt
                                    ? new Date(
                                          appliance.history.boughtAt,
                                      ).toISOString()
                                    : null,
                                soldAt: appliance.history.soldAt
                                    ? new Date(
                                          appliance.history.soldAt,
                                      ).toISOString()
                                    : null,
                                createdBy: appliance.updatedBy,
                                createdAt: new Date().toISOString(),
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

        if (!updatedAppliance.id)
            return NextResponse.json({
                message: "Cihaz müşteri geçmişi güncellenemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "create",
                table: "applianceHistory",
                user: updatedAppliance.updatedBy || "",
                date: new Date().toISOString(),
                description: `Appliance history added: ${updatedAppliance.id}`,
                data: JSON.stringify(updatedAppliance),
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
