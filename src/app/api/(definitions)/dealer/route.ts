import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(request: Request) {
    try {
        const data = await prisma.dealers.findMany({
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
            const dealer: Dealer = await request.json();

            const newDealer = await prisma.dealers.create({
                data: dealer,
            });

            if (newDealer.id) {
                return NextResponse.json(
                    {
                        message: "Bayi başarıyla kaydedildi!",
                    },
                    { status: 200 },
                );
            } else {
                return NextResponse.json(
                    {
                        message: "Bayi kaydedilemedi!",
                    },
                    { status: 400 },
                );
            }
        } catch (error) {
            return NextResponse.json({ message: error }, { status: 500 });
        }
    }
}
