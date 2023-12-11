import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const data = await prisma.dealers.findFirst({
            where: {
                id: Number(params.id),
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
        const dealer: Dealer = await request.json();
        dealer.updatedAt = new Date().toISOString();

        await prisma.dealers.update({
            where: {
                id: Number(params.id),
            },
            data: dealer,
        });

        return NextResponse.json(
            {
                message: "Bayi başarıyla güncellendi!",
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
        const dealer: Dealer = await request.json();

        await prisma.dealers.delete({
            where: {
                id: Number(params.id),
            },
        });

        return NextResponse.json(
            {
                message: "Bayi silindi!",
            },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
