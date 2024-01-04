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
                            brand: true,
                            model: true,
                        },
                    },
                    licenses: {
                        select: {
                            id: true,
                            startDate: true,
                            expiryDate: true,
                            isStock: true,
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
        });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
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

            await prisma.appliances.update({
                where: {
                    id: Number(params.id),
                },
                data: appliance,
            });

            return NextResponse.json(
                {
                    message: "Cihaz başarıyla güncellendi!",
                },
                { status: 200 },
            );
        }

        return NextResponse.json({
            message: "Authorization Needed!",
            status: 401,
        });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
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

            return NextResponse.json(
                {
                    message: "Cihaz silindi!",
                },
                { status: 200 },
            );
        }

        return NextResponse.json({
            message: "Authorization Needed!",
            status: 401,
        });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
