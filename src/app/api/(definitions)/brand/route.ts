import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function GET(request: Request) {
    try {
        const session = await getServerSession();

        if (session) {
            const data = await prisma.brands.findMany({
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
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500 });
    }
}

export async function POST(request: Request) {
    if (request) {
        try {
            const brand: Brand = await request.json();

            const newBrand = await prisma.brands.create({
                data: brand,
            });

            if (newBrand.id) {
                return NextResponse.json({
                    message: "Marka başarıyla kaydedildi!",
                    status: 200,
                });
            } else {
                return NextResponse.json({
                    message: "Marka kaydedilemedi!",
                    status: 400,
                });
            }
        } catch (error) {
            return NextResponse.json({ message: error, status: 500 });
        }
    }
}
