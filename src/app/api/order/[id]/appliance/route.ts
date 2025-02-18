import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

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

        const order = {
            applianceId: Number(request.nextUrl.searchParams.get("applianceId")),
            updatedAt: new Date().toISOString(),
            updatedBy: session?.user?.email || "",
        };

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
                description: `Order appliance updated: ${updatedOrder.id}`,
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
