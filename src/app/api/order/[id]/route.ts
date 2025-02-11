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
                items: {
                    include: {
                        product: {
                            select: {
                                model: true,
                                brand: {
                                    select: { name: true },
                                },
                                productType: {
                                    select: { type: true },
                                },
                            },
                        },
                        licenseType: {
                            select: {
                                type: true,
                                duration: true,
                                brand: {
                                    select: { name: true },
                                },
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
        order.expiry = order.expiry
            ? new Date(order.expiry).toISOString()
            : null;

        const updatedOrder = await prisma.orders.update({
            where: {
                id: Number(params.id),
            },
            data: order,
        });

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
