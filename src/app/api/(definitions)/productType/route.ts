import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function GET() {
    try {
        const session = await getServerSession();

        if (!session)
            return NextResponse.json({
                message: "Authorization Needed!",
                status: 401,
                ok: false,
            });

        const data = await prisma.productTypes.findMany({
            orderBy: [
                {
                    createdAt: "asc",
                },
            ],
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session)
            return NextResponse.json({
                message: "Authorization Needed!",
                status: 401,
                ok: false,
            });

        const productType: ProductType = await request.json();

        const newProductType = await prisma.productTypes.create({
            data: productType,
        });

        if (!newProductType.id)
            return NextResponse.json({
                message: "Ürün tipi kaydedilemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "create",
                table: "productTypes",
                user: newProductType.createdBy,
                date: new Date().toISOString(),
                description: `Product type created: ${newProductType.id}`,
                data: JSON.stringify(newProductType),
            },
        });

        return NextResponse.json({
            message: "Ürün tipi başarıyla kaydedildi!",
            status: 200,
            ok: true,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
