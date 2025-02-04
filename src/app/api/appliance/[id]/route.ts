import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function GET({ params }: { params: { id: string } }) {
    try {
        const session = await getServerSession();

        if (!session)
            return NextResponse.json({
                message: "Authorization Needed!",
                status: 401,
                ok: false,
            });

        const data = await prisma.appliances.findUnique({
            where: {
                id: Number(params.id),
            },
            include: {
                product: {
                    select: {
                        brand: { select: { name: true } },
                    },
                },
                licenses: {
                    select: {
                        id: true,
                        startDate: true,
                        expiryDate: true,
                        licenseType: {
                            select: {
                                type: true,
                                duration: true,
                                brand: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: [
                        {
                            expiryDate: "desc",
                        },
                    ],
                },

                history: {
                    orderBy: {
                        soldAt: "desc",
                    },
                    select: {
                        id: true,
                        createdBy: true,
                        createdAt: true,
                        updatedBy: true,
                        updatedAt: true,
                        cusName: true,
                        boughtAt: true,
                        soldAt: true,
                        customerId: true,
                        customer: {
                            select: { id: true, name: true },
                        },
                    },
                },
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

        const appliance: Appliance = await request.json();
        appliance.updatedAt = new Date().toISOString();
        appliance.boughtAt = appliance.boughtAt
            ? new Date(appliance.boughtAt).toISOString()
            : null;
        appliance.soldAt = appliance.soldAt
            ? new Date(appliance.soldAt).toISOString()
            : null;

        // const checkSerialNo = await prisma.appliances.findUnique({
        //     where: {
        //         NOT: { id: Number(params.id) },
        //         serialNo: appliance.serialNo,
        //     },
        //     select: {
        //         serialNo: true,
        //     },
        // });
        // if (checkSerialNo)
        //     return NextResponse.json({
        //         message: "Bu seri numarası önceden kullanılmıştır!",
        //         status: 400,
        //         ok: false,
        //     });

        // if (appliance.predecessorId) {
        //     const checkPredecessor = await prisma.appliances.findUnique({
        //         where: {
        //             NOT: { id: Number(params.id) },
        //             predecessorId: appliance.predecessorId,
        //         },
        //         select: {
        //             predecessorId: true,
        //         },
        //     });
        //     if (checkPredecessor)
        //         return NextResponse.json({
        //             message:
        //                 "Bu cihaz önceden başka bir cihazda eski cihaz olarak kullanılmıştır!",
        //             status: 400,
        //             ok: false,
        //         });
        // }

        const updatedAppliance = await prisma.appliances.update({
            where: {
                id: Number(params.id),
            },
            data: appliance,
        });

        if (!updatedAppliance.id)
            return NextResponse.json({
                message: "Cihaz güncellenemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "update",
                table: "appliances",
                user: updatedAppliance.updatedBy || "",
                date: new Date().toISOString(),
                description: `Appliance updated: ${updatedAppliance.id}`,
                data: JSON.stringify(updatedAppliance),
            },
        });

        return NextResponse.json({
            message: "Cihaz başarıyla güncellendi!",
            status: 200,
            ok: true,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getServerSession();

        if (!session)
            return NextResponse.json({
                message: "Authorization Needed!",
                status: 401,
            });

        const appliance: Appliance = await request.json();
        appliance.updatedAt = new Date().toISOString();

        const deletedAppliance = await prisma.appliances.update({
            where: {
                id: Number(params.id),
            },
            data: {
                deleted: true,
            },
        });

        if (!deletedAppliance.id)
            return NextResponse.json({
                message: "Cihaz silinirken bir hata oluştu!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "delete",
                table: "appliances",
                user: deletedAppliance.updatedBy || "",
                date: new Date().toISOString(),
                description: `Appliance deleted: ${deletedAppliance.id}`,
                data: JSON.stringify(deletedAppliance),
            },
        });

        return NextResponse.json({
            message: "Cihaz silindi!",
            status: 200,
            ok: true,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500 });
    }
}
