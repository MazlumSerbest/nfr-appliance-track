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

        const data = await prisma.vProducts.findMany({
            orderBy: [
                {
                    createdAt: "desc",
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

        const product: any = await request.json();

        const newProduct = await prisma.products.create({
            data: product,
        });

        if (!newProduct.id)
            return NextResponse.json({
                message: "Ürün kaydedilemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "create",
                table: "products",
                user: newProduct.createdBy,
                date: new Date().toISOString(),
                description: `Product created: ${newProduct.id}`,
                data: JSON.stringify(newProduct),
            },
        });

        return NextResponse.json({
            message: "Ürün başarıyla kaydedildi!",
            status: 200,
            ok: true,
        });
    } catch (error) {
        return NextResponse.json({
            message: error,
            status: 500,
            ok: false,
        });
    }
}
