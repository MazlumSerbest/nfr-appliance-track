import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function GET(
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

        const data = await prisma.products.findUnique({
            where: {
                id: Number(params.id),
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

        const product: any = await request.json();
        product.updatedAt = new Date().toISOString();

        const updatedProduct = await prisma.products.update({
            where: {
                id: Number(params.id),
            },
            data: product,
        });

        if (!updatedProduct.id)
            return NextResponse.json({
                message: "Ürün güncellenemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "update",
                table: "products",
                user: updatedProduct.updatedBy || "",
                date: new Date().toISOString(),
                description: `Product updated: ${updatedProduct.id}`,
                data: JSON.stringify(updatedProduct),
            },
        });

        return NextResponse.json({
            message: "Ürün başarıyla güncellendi!",
            status: 200,
            ok: true,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
