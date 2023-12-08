import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(request: Request) {
    try {
        const data = await prisma.licenseTypes.findMany({
            include: {
                product: {
                    select: {
                        brand: true,
                        model: true,
                    },
                },
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
            const licenseType: LicenseType = await request.json();

            const newLicenseType = await prisma.licenseTypes.create({
                data: licenseType,
            });

            if (newLicenseType.id) {
                return NextResponse.json(
                    {
                        message: "Lisans tipi başarıyla kaydedildi!",
                    },
                    { status: 200 },
                );
            } else {
                return NextResponse.json(
                    {
                        message: "Lisans tipi kaydedilemedi!",
                    },
                    { status: 400 },
                );
            }
        } catch (error) {
            return NextResponse.json({ message: error }, { status: 500 });
        }
    }
}
