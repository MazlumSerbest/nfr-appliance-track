import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (session) {
            const data = await prisma.productTypes.findMany({
                orderBy: [
                    {
                        createdAt: "asc",
                    },
                ],
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

export async function POST(request: Request) {
    try {
        const session = await getServerSession();

        if (session) {
            const productType: ProductType = await request.json();

            const newProductType = await prisma.productTypes.create({
                data: productType,
            });

            if (newProductType.id) {
                return NextResponse.json({
                    message: "Ürün tipi başarıyla kaydedildi!",
                    status: 200,
                });
            } else {
                return NextResponse.json({
                    message: "Ürün tipi kaydedilemedi!",
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
