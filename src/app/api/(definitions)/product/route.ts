import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function GET(request: Request) {
    try {
        const session = await getServerSession();

        if (session) {
            const data = await prisma.vProducts.findMany({
                orderBy: [
                    {
                        createdAt: "desc",
                    },
                ],
            });

            return NextResponse.json(data);
        }

        return NextResponse.json({
            message: "Authorization Needed!",
            status: 401,
            ok: false,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}

export async function POST(request: Request) {
    if (request) {
        try {
            const product: any = await request.json();

            const newProduct = await prisma.products.create({
                data: product,
            });

            if (newProduct.id) {
                return NextResponse.json({
                    message: "Ürün başarıyla kaydedildi!",
                    status: 200,
                    ok: true,
                });
            } else {
                return NextResponse.json({
                    message: "Ürün kaydedilemedi!",
                    status: 400,
                    ok: false,
                });
            }
        } catch (error) {
            return NextResponse.json({
                message: error,
                status: 500,
                ok: false,
            });
        }
    }
}
