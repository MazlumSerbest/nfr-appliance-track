import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(request: NextRequest) {
    try {
        const data = await prisma.vLicenses.findMany({
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
            const license: License = await request.json();
            license.startDate = license.startDate
                ? new Date(license.startDate).toISOString()
                : undefined;
            license.expiryDate = license.expiryDate
                ? new Date(license.expiryDate).toISOString()
                : undefined;
            license.boughtAt = license.boughtAt
                ? new Date(license.boughtAt).toISOString()
                : undefined;
            license.soldAt = license.soldAt
                ? new Date(license.soldAt).toISOString()
                : undefined;

            const newLicense = await prisma.licenses.create({
                data: license,
            });

            if (newLicense.id) {
                return NextResponse.json(
                    {
                        message: "Lisans başarıyla kaydedildi!",
                    },
                    { status: 200 },
                );
            } else {
                return NextResponse.json(
                    {
                        message: "Lisans kaydedilemedi!",
                    },
                    { status: 400 },
                );
            }
        } catch (error) {
            return NextResponse.json({ message: error }, { status: 500 });
        }
    }
}
