import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const data = await prisma.licenses.findUnique({
            where: {
                id: Number(params.id)
            },
            include: {
                appliance: {
                    select: {
                        id: true,
                        serialNo: true,
                        boughtAt: true,
                        soldAt: true,
                    },
                },
                licenseType: {
                    select: {
                        type: true,
                        duration: true,
                        product: {
                            select: {
                                type: true,
                                brand: true,
                                model: true,
                            },
                        },
                    },
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
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const license: Customer = await request.json();
        license.updatedAt = new Date().toISOString();

        await prisma.licenses.update({
            where: {
                id: Number(params.id),
            },
            data: license,
        });

        return NextResponse.json(
            {
                message: "Lisans başarıyla güncellendi!",
            },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const license: License = await request.json();
        license.updatedAt = new Date().toISOString();

        await prisma.licenses.update({
            where: {
                id: Number(params.id),
            },
            data: {
                deleted: true,
            },
        });

        return NextResponse.json(
            {
                message: "Lisans silindi!",
            },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
