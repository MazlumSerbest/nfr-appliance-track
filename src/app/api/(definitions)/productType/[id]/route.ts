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

        const data = await prisma.productTypes.findUnique({
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

        const productType: ProductType = await request.json();
        productType.updatedAt = new Date().toISOString();

        const updatedProductType = await prisma.productTypes.update({
            where: {
                id: Number(params.id),
            },
            data: productType,
        });

        if (!updatedProductType.id)
            return NextResponse.json({
                message: "Ürün tipi güncellenemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "update",
                table: "productTypes",
                user: updatedProductType.updatedBy || "",
                date: new Date().toISOString(),
                description: `Product type updated: ${updatedProductType.id}`,
                data: JSON.stringify(updatedProductType),
            },
        });

        return NextResponse.json({
            message: "Ürün tipi başarıyla güncellendi!",
            status: 200,
            ok: true,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
