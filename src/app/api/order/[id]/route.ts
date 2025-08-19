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
                    },
                },
                license: {
                    select: {
                        serialNo: true,
                        applianceId: true,
                        appSerialNo: true,
                        startDate: true,
                        expiryDate: true,
                        boughtTypeId: true,
                        productId: true,
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
                        licenseTypeId: true,
                        licenseType: {
                            select: { id: true },
                        },
                        appliance: {
                            select: {
                                id: true,
                                serialNo: true,
                                productId: true,
                            },
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
        order.boughtAt = order.boughtAt
            ? new Date(order.boughtAt).toISOString()
            : null;

        const appliance = {
            updatedAt: new Date().toISOString(),
            updatedBy: order.updatedBy,
            soldAt: order.soldAt,
            boughtAt: order.boughtAt,
            cusName: order.cusName,
            customerId: order.customerId,
            dealerId: order.dealerId,
            subDealerId: order.subDealerId,
            supplierId: order.supplierId,
            invoiceCurrentId: order.invoiceCurrentId,
        };

        const license = {
            updatedAt: new Date().toISOString(),
            updatedBy: order.updatedBy,
            startDate: order.licenseStartDate
                ? new Date(order.licenseStartDate).toISOString()
                : null,
            expiryDate: order.licenseExpiryDate
                ? new Date(order.licenseExpiryDate).toISOString()
                : null,
            appSerialNo: order.licenseAppSerialNo,
            productId: order.licenseProductId,
            boughtTypeId: order.licenseBoughtTypeId,
            serialNo: order.licenseSerialNo,
            licenseTypeId: order.licenseTypeId,
            soldAt: order.soldAt,
            boughtAt: order.boughtAt,
            cusName: order.cusName,
            customerId: order.customerId,
            dealerId: order.dealerId,
            subDealerId: order.subDealerId,
            supplierId: order.supplierId,
            invoiceCurrentId: order.invoiceCurrentId,
            applianceId: order.applianceId,
        };

        delete order["licenseStartDate"];
        delete order["licenseExpiryDate"];
        delete order["licenseAppSerialNo"];
        delete order["licenseProductId"];
        delete order["licenseBoughtTypeId"];
        delete order["licenseSerialNo"];
        delete order["licenseTypeId"];

        const updatedOrder = await prisma.orders.update({
            where: {
                id: Number(params.id),
            },
            data: order,
        });

        if (order.applianceId) {
            const updatedAppliance = await prisma.appliances.update({
                where: {
                    id: order.applianceId,
                },
                data: appliance,
            });

            if (!updatedAppliance.id)
                return NextResponse.json({
                    message: "Siparişe bağlı cihaz güncellenirken hata oluştu!",
                    status: 400,
                    ok: false,
                });
        }

        if (order.licenseId) {
            const updatedLicense = await prisma.licenses.update({
                where: {
                    id: order.licenseId,
                },
                data: license,
            });

            if (!updatedLicense.id)
                return NextResponse.json({
                    message:
                        "Siparişe bağlı lisans güncellenirken hata oluştu!",
                    status: 400,
                    ok: false,
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
