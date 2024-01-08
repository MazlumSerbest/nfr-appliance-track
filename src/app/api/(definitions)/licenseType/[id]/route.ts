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
            const data = await prisma.licenseTypes.findUnique({
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
            const licenseType: LicenseType = await request.json();
            licenseType.updatedAt = new Date().toISOString();

            const updateLicenseType = await prisma.licenseTypes.update({
                where: {
                    id: Number(params.id),
                },
                data: licenseType,
            });

            if (updateLicenseType.id) {
                return NextResponse.json({
                    message: "Lisans tipi başarıyla güncellendi!",
                    status: 200,
                });
            } else {
                return NextResponse.json({
                    message: "Lisans tipi güncellenemedi!",
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
