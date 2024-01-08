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
            const data = await prisma.licenses.findUnique({
                include: {
                    appliance: {
                        select: {
                            id: true,
                            serialNo: true,
                            boughtAt: true,
                            soldAt: true,
                        },
                    },
                    licenseType: {
                        select: {
                            type: true,
                            duration: true,
                        },
                    },
                    boughtType: {
                        select: {
                            type: true,
                        },
                    },
                    customer: {
                        select: { name: true },
                    },
                    dealer: {
                        select: { name: true },
                    },
                    subDealer: {
                        select: { name: true },
                    },
                    supplier: {
                        select: { name: true },
                    },
                },
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
            const license: License = await request.json();
            license.updatedAt = new Date().toISOString();
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

            const updateLicense = await prisma.licenses.update({
                data: license,
                where: {
                    id: Number(params.id),
                },
            });

            if (updateLicense.id) {
                return NextResponse.json({
                    message: "Lisans başarıyla güncellendi!",
                    status: 200,
                });
            } else {
                return NextResponse.json({
                    message: "Lisans güncellenemedi!",
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

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getServerSession();

        if (session) {
            const license: License = await request.json();
            license.updatedAt = new Date().toISOString();

            await prisma.licenses.update({
                data: {
                    deleted: true,
                },
                where: {
                    id: Number(params.id),
                },
            });

            return NextResponse.json({
                message: "Lisans silindi!",
                status: 200,
            });
        }

        return NextResponse.json({
            message: "Authorization Needed!",
            status: 401,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500 });
    }
}
