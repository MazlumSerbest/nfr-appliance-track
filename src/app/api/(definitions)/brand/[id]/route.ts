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
            const data = await prisma.brands.findUnique({
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
            const brand: Brand = await request.json();
            brand.updatedAt = new Date().toISOString();

            const updateBrand = await prisma.brands.update({
                where: {
                    id: Number(params.id),
                },
                data: brand,
            });

            if (updateBrand.id) {
                return NextResponse.json({
                    message: "Marka başarıyla güncellendi!",
                    status: 200,
                });
            } else {
                return NextResponse.json({
                    message: "Marka güncellenemedi!",
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
