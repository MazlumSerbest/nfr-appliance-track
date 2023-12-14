import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(request: Request) {
    try {
        const data = await prisma.vAppliances.findMany({
            where: {
                deleted: false
            },
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
            const appliance: Appliance = await request.json();

            const newAppliance = await prisma.appliances.create({
                data: appliance,
            });

            if (newAppliance.id) {
                return NextResponse.json(
                    {
                        message: "Cihaz başarıyla kaydedildi!",
                    },
                    { status: 200 },
                );
            } else {
                return NextResponse.json(
                    {
                        message: "Cihaz kaydedilemedi!",
                    },
                    { status: 400 },
                );
            }
        } catch (error) {
            return NextResponse.json({ message: error }, { status: 500 });
        }
    }
}
