import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const data = await prisma.suppliers.findFirst({
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
        const suppliers: Supplier = await request.json();
        suppliers.updatedAt = new Date().toISOString();

        await prisma.suppliers.update({
            where: {
                id: Number(params.id),
            },
            data: suppliers,
        });

        return NextResponse.json(
            {
                message: "Tedarikçi başarıyla güncellendi!",
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
        const suppliers: Supplier = await request.json();

        await prisma.suppliers.delete({
            where: {
                id: Number(params.id),
            },
        });

        return NextResponse.json(
            {
                message: "Tedarikçi silindi!",
            },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
