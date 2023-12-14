import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const data = await prisma.customers.findUnique({
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
        const customer: Customer = await request.json();
        customer.updatedAt = new Date().toISOString();

        await prisma.customers.update({
            where: {
                id: Number(params.id),
            },
            data: customer,
        });

        return NextResponse.json(
            {
                message: "Müşteri başarıyla güncellendi!",
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
        const customer: Customer = await request.json();

        await prisma.customers.delete({
            where: {
                id: Number(params.id),
            },
        });

        return NextResponse.json(
            {
                message: "Müşteri silindi!",
            },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
