import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(request: NextRequest) {
    try {
        const data = await prisma.boughtTypes.findMany({
            orderBy: [
                {
                    createdAt: "asc",
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
            const boughtType: BoughtType = await request.json();

            const newBoughtType = await prisma.boughtTypes.create({
                data: boughtType,
            });

            if (newBoughtType.id) {
                return NextResponse.json(
                    {
                        message: "Alım tipi başarıyla kaydedildi!",
                    },
                    { status: 200 },
                );
            } else {
                return NextResponse.json(
                    {
                        message: "Alım tipi kaydedilemedi!",
                    },
                    { status: 400 },
                );
            }
        } catch (error) {
            return NextResponse.json({ message: error }, { status: 500 });
        }
    }
}
