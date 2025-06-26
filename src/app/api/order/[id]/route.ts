import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getServerSession();

        if (!session)
            return NextResponse.json({
                message: "Authorization Needed!",
                status: 401,
                ok: false,
            });

        const data = await prisma.orders.findUnique({
            include: {
                appliance: {
                    select: {
                        serialNo: true,
                        productId: true,
                        product: {
                            select: { id: true },
                        },
                        licenses: {
                            select: {
                                id: true,
                                serialNo: true,
                                licenseType: {
                                    select: {
                                        id: true,
                                        type: true,
                                        duration: true,
                                        brand: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                    },
                                },
                            },
                            take: 1,
                            orderBy: {
                                createdAt: "desc",
                            },
                        },
                    },
                },
                license: {
                    select: {
                        serialNo: true,
                        applianceId: true,
                        appSerialNo: true,
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
                            select: { id: true },
                        },
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
                invoiceCurrent: {
                    select: { name: true },
                },
            },
            where: {
                id: Number(params.id),
            },
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getServerSession();

        if (!session)
            return NextResponse.json({
                message: "Authorization Needed!",
                status: 401,
                ok: false,
            });

        const order: Order = await request.json();
        order.updatedAt = new Date().toISOString();
        order.soldAt = order.soldAt
            ? new Date(order.soldAt).toISOString()
            : null;

        const updatedOrder = await prisma.orders.update({
            where: {
                id: Number(params.id),
            },
            data: order,
        });

        if (updatedOrder.applianceId) {
            await prisma.appliances.update({
                where: {
                    id: updatedOrder.applianceId,
                },
                data: {
                    soldAt: order.soldAt || undefined,
                    customerId: order.customerId || undefined,
                    cusName: order.cusName || undefined,
                    dealerId: order.dealerId || undefined,
                    subDealerId: order.subDealerId || undefined,
                    supplierId: order.supplierId || undefined,
                },
            });
        }

        if (updatedOrder.licenseId) {
            await prisma.licenses.update({
                where: {
                    id: updatedOrder.licenseId,
                },
                data: {
                    applianceId: updatedOrder.applianceId || undefined,
                    soldAt: order.soldAt || undefined,
                    customerId: order.customerId || undefined,
                    cusName: order.cusName || undefined,
                    dealerId: order.dealerId || undefined,
                    subDealerId: order.subDealerId || undefined,
                    supplierId: order.supplierId || undefined,
                },
            });
        }

        if (!updatedOrder.id)
            return NextResponse.json({
                message: "Sipariş güncellenemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "update",
                table: "orders",
                user: updatedOrder.updatedBy || "",
                date: new Date().toISOString(),
                description: `Order updated: ${updatedOrder.id}`,
                data: JSON.stringify(updatedOrder),
            },
        });

        return NextResponse.json({
            message: "Sipariş başarıyla güncellendi!",
            status: 200,
            ok: true,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
