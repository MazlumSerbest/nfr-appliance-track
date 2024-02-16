import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (session) {
            const data = await prisma.vLicenses.findMany({
                // where: {
                //     deleted: false,
                // },
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
    try {
        const session = await getServerSession();

        if (session) {
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
            license.orderedAt = license.orderedAt
                ? new Date(license.orderedAt).toISOString()
                : undefined;

            const checkSerialNo = await prisma.licenses.findUnique({
                where: {
                    serialNo: license.serialNo,
                },
                select: {
                    serialNo: true,
                },
            });
            if (checkSerialNo)
                return NextResponse.json({
                    message: "Bu seri numarası önceden kullanılmıştır!",
                    status: 400,
                });

            const newLicense = await prisma.licenses.create({
                data: license,
            });

            if (newLicense.id) {
                return NextResponse.json({
                    message: "Lisans başarıyla kaydedildi!",
                    status: 200,
                });
            } else {
                return NextResponse.json({
                    message: "Lisans kaydedilemedi!",
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
