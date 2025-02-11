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
        order.expiry = order.expiry
            ? new Date(order.expiry).toISOString()
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
