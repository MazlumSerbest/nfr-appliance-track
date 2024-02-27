import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function GET(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getServerSession();

        if (session) {
            const data = await prisma.appliances.findUnique({
                where: {
                    id: Number(params.id),
                },
                include: {
                    product: {
                        select: {
                            brand: { select: { name: true } },
                            productType: { select: { type: true } },
                            model: true,
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
                                },
                            },
                        },
                        orderBy: [
                            {
                                expiryDate: "desc",
                            },
                        ],
                    },
                    customer: {
                        select: { name: true },
                    },
                    dealer: {
                        select: { name: true },
                    },
                    subDealer: {
                        select: { name: true },
                    },
                    supplier: {
                        select: { name: true },
                    },
                },
            });

            return NextResponse.json(data);
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

export async function PUT(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getServerSession();

        if (session) {
            const appliance: Appliance = await request.json();
            appliance.updatedAt = new Date().toISOString();
            appliance.boughtAt = appliance.boughtAt
                ? new Date(appliance.boughtAt).toISOString()
                : undefined;
            appliance.soldAt = appliance.soldAt
                ? new Date(appliance.soldAt).toISOString()
                : undefined;

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

            const updateAppliance = await prisma.appliances.update({
                where: {
                    id: Number(params.id),
                },
                data: appliance,
            });

            if (updateAppliance.id) {
                return NextResponse.json({
                    message: "Cihaz başarıyla güncellendi!",
                    status: 200,
                    ok: true,
                });
            } else {
                return NextResponse.json({
                    message: "Cihaz güncellenemedi!",
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

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getServerSession();

        if (session) {
            const appliance: Appliance = await request.json();
            appliance.updatedAt = new Date().toISOString();

            await prisma.appliances.update({
                where: {
                    id: Number(params.id),
                },
                data: {
                    deleted: true,
                },
            });

            return NextResponse.json({
                message: "Cihaz silindi!",
                status: 200,
            });
        }

        return NextResponse.json({
            message: "Authorization Needed!",
            status: 401,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500 });
    }
}
