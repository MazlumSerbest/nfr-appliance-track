import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function GET() {
    try {
        const session = await getServerSession();

        if (!session)
            return NextResponse.json({
                message: "Authorization Needed!",
                status: 401,
                ok: false,
            });

        const data = await prisma.vOrders.findMany({
            orderBy: [
                {
                    createdAt: "desc",
                },
            ],
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session)
            return NextResponse.json({
                message: "Authorization Needed!",
                status: 401,
                ok: false,
            });

        const order: Order = await request.json();
        order.soldAt = order.soldAt
            ? new Date(order.soldAt).toISOString()
            : null;
        order.boughtAt = order.boughtAt
            ? new Date(order.boughtAt).toISOString()
            : null;

        const newOrder = await prisma.orders.create({
            data: order,
        });

        if (!newOrder.id)
            return NextResponse.json({
                message: "Sipariş kaydedilemedi!",
                status: 400,
                ok: false,
            });

        if (order.type === "standard" && order.applianceId) {
            const updatedAppliance = await prisma.appliances.update({
                where: {
                    id: order.applianceId,
                },
                data: {
                    soldAt: order.soldAt,
                    boughtAt: order.boughtAt,
                    cusName: order.cusName,
                    customerId: order.customerId,
                    dealerId: order.dealerId,
                    subDealerId: order.subDealerId,
                    supplierId: order.supplierId,
                    invoiceCurrentId: order.invoiceCurrentId,
                    licenses: {
                        updateMany: {
                            where: {
                                applianceId: order.applianceId,
                            },
                            data: {
                                soldAt: order.soldAt,
                                boughtAt: order.boughtAt,
                                cusName: order.cusName,
                                customerId: order.customerId,
                                dealerId: order.dealerId,
                                subDealerId: order.subDealerId,
                                supplierId: order.supplierId,
                                invoiceCurrentId: order.invoiceCurrentId,
                            },
                        },
                    },
                },
            });

            if (!updatedAppliance.id)
                return NextResponse.json({
                    message: "Siparişe bağlı cihaz güncellenirken hata oluştu!",
                    status: 400,
                    ok: false,
                });
        } else if (order.type === "license" && order.licenseId) {
            const updatedLicense = await prisma.licenses.update({
                where: {
                    id: order.licenseId,
                },
                data: {
                    soldAt: order.soldAt,
                    boughtAt: order.boughtAt,
                    cusName: order.cusName,
                    customerId: order.customerId,
                    dealerId: order.dealerId,
                    subDealerId: order.subDealerId,
                    supplierId: order.supplierId,
                    invoiceCurrentId: order.invoiceCurrentId,
                },
            });

            if (!updatedLicense.id)
                return NextResponse.json({
                    message: "Siparişe bağlı lisans güncellenirken hata oluştu!",
                    status: 400,
                    ok: false,
                });
        }

        await prisma.logs.create({
            data: {
                action: "create",
                table: "orders",
                user: newOrder.createdBy,
                date: new Date().toISOString(),
                description: `Order created: ${newOrder.id}`,
                data: JSON.stringify(newOrder),
            },
        });

        return NextResponse.json({
            message: "Sipariş başarıyla kaydedildi!",
            status: 200,
            ok: true,
            id: newOrder.id,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
