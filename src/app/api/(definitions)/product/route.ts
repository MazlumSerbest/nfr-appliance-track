import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(request: Request) {
    try {
        const data = await prisma.products.findMany({
            orderBy: [
                {
                    createdAt: "desc",
                },
            ],
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (request) {
        try {
            const product: Product = await request.json();

            const newProduct = await prisma.products.create({
                data: product,
            });

            if (newProduct.id) {
                return NextResponse.json(
                    {
                        message: "Ürün başarıyla kaydedildi!",
                    },
                    { status: 200 },
                );
            } else {
                return NextResponse.json(
                    {
                        message: "Ürün kaydedilemedi!",
                    },
                    { status: 400 },
                );
            }
        } catch (error) {
            return NextResponse.json({ message: error }, { status: 500 });
        }
    }
}
