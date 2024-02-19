import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (session) {
            const data = await prisma.licenseTypes.findMany({
                include: {
                    brand: { select: { name: true } },
                },
                orderBy: [
                    {
                        createdAt: "asc",
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
    try {
        const session = await getServerSession();

        if (session) {
            const licenseType: any = await request.json();

            const newLicenseType = await prisma.licenseTypes.create({
                data: licenseType,
            });

            if (newLicenseType.id) {
                return NextResponse.json({
                    message: "Lisans tipi başarıyla kaydedildi!",
                    status: 200,
                    ok: true,
                });
            } else {
                return NextResponse.json({
                    message: "Lisans tipi kaydedilemedi!",
                    status: 400,
                    ok: false,
                });
            }
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
