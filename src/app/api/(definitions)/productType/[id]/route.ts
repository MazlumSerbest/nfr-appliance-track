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
            const data = await prisma.productTypes.findUnique({
                where: {
                    id: Number(params.id),
                },
            });

            return NextResponse.json(data);
        }

        return NextResponse.json({
            message: "Authorization Needed!",
            status: 401,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getServerSession();

        if (session) {
            const productType: ProductType = await request.json();
            productType.updatedAt = new Date().toISOString();

            const updateProductType = await prisma.productTypes.update({
                where: {
                    id: Number(params.id),
                },
                data: productType,
            });

            if (updateProductType.id) {
                return NextResponse.json({
                    message: "Ürün tipi başarıyla güncellendi!",
                    status: 200,
                });
            } else {
                return NextResponse.json({
                    message: "Ürün tipi güncellenemedi!",
                    status: 400,
                });
            }
        }

        return NextResponse.json({
            message: "Authorization Needed!",
            status: 401,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500 });
    }
}
