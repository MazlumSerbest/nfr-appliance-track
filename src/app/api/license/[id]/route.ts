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
                            product: {
                                select: {
                                    model: true,
                                    brand: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    product: {
                        select: {
                            model: true,
                            brand: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                    licenseType: {
                        select: {
                            type: true,
                            duration: true,
                        },
                    },
                    history: {
                        orderBy: {
                            expiryDate: "desc",
                        },
                        select: {
                            id: true,
                            createdBy: true,
                            createdAt: true,
                            updatedBy: true,
                            updatedAt: true,
                            serialNo: true,
                            startDate: true,
                            expiryDate: true,
                            licenseTypeId: true,
                            boughtTypeId: true,
                            licenseType: {
                                select: {
                                    type: true,
                                    duration: true,
                                    brand: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                            },
                            boughtType: {
                                select: {
                                    type: true,
                                },
                            },
                            dealer: {
                                select: { id: true, name: true },
                            },
                            subDealer: {
                                select: { id: true, name: true },
                            },
                            supplier: {
                                select: { id: true, name: true },
                            },
                        },
                    },
                    // boughtType: {
                    //     select: {
                    //         type: true,
                    //     },
                    // },
                    customer: {
                        select: { name: true, email: true },
                    },
                    dealer: {
                        select: { name: true, email: true },
                    },
                    subDealer: {
                        select: { name: true, email: true },
                    },
                    supplier: {
                        select: { name: true },
                    }
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
            ok: false,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
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
                : null;
            license.expiryDate = license.expiryDate
                ? new Date(license.expiryDate).toISOString()
                : null;
            license.boughtAt = license.boughtAt
                ? new Date(license.boughtAt).toISOString()
                : null;
            license.soldAt = license.soldAt
                ? new Date(license.soldAt).toISOString()
                : null;
            license.orderedAt = license.orderedAt
                ? new Date(license.orderedAt).toISOString()
                : null;

            license.applianceId ? (license.productId = null) : null;

            // const checkSerialNo = await prisma.licenses.findUnique({
            //     where: {
            //         NOT: { id: Number(params.id) },
            //         serialNo: license.serialNo,
            //     },
            //     select: {
            //         serialNo: true,
            //     },
            // });
            // if (checkSerialNo)
            //     return NextResponse.json({
            //         message: "Bu seri numarası önceden kullanılmıştır!",
            //         status: 400,
            //         ok: false,
            //     });

            const updatedLicense = await prisma.licenses.update({
                data: license,
                where: {
                    id: Number(params.id),
                },
            });

            if (updatedLicense.id) {
                await prisma.logs.create({
                    data: {
                        action: "update",
                        table: "licenses",
                        user: updatedLicense.updatedBy || "",
                        date: new Date().toISOString(),
                        description: `License updated: ${updatedLicense.id}`,
                        data: JSON.stringify(updatedLicense),
                    },
                });

                return NextResponse.json({
                    message: "Lisans başarıyla güncellendi!",
                    status: 200,
                    ok: true,
                });
            } else {
                return NextResponse.json({
                    message: "Lisans güncellenemedi!",
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

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getServerSession();

        if (session) {
            const license: License = await request.json();
            license.updatedAt = new Date().toISOString();

            const deletedLicense = await prisma.licenses.update({
                data: {
                    deleted: true,
                },
                where: {
                    id: Number(params.id),
                },
            });

            if (deletedLicense.id) {
                await prisma.logs.create({
                    data: {
                        action: "delete",
                        table: "licenses",
                        user: deletedLicense.updatedBy || "",
                        date: new Date().toISOString(),
                        description: `License deleted: ${deletedLicense.id}`,
                        data: JSON.stringify(deletedLicense),
                    },
                });

                return NextResponse.json({
                    message: "Lisans silindi!",
                    status: 200,
                    ok: true,
                });
            } else {
                return NextResponse.json({
                    message: "Lisans silinirken bir hata oluştu!",
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
