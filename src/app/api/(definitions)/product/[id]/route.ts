import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const data = await prisma.products.findFirst({
            where: {
                id: Number(params.id),
            },
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: error });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const product: Product = await request.json();
        product.updatedAt = new Date().toISOString();
        const data = await prisma.products.update({
            where: {
                id: Number(params.id),
            },
            data: product,
        });

        return NextResponse.json(
            {
                message: "Ürün başarıyla güncellendi!",
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
        const product: Product = await request.json();
        
        await prisma.products.delete({
            where: {
                id: Number(params.id),
            },
        });

        return NextResponse.json(
            {
                message: "Ürün silindi!",
            },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
