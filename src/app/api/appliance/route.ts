import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session)
            return NextResponse.json({
                message: "Authorization Needed!",
                status: 401,
                ok: false,
            });

        let productId = Number(request.nextUrl.searchParams.get("productId"));

        const data = await prisma.vAppliances.findMany({
            where: {
                ...(productId ? { productId: productId } : {}),
            },
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

        const appliance: Appliance = await request.json();
        appliance.boughtAt = appliance.boughtAt
            ? new Date(appliance.boughtAt).toISOString()
            : undefined;
        appliance.soldAt = appliance.soldAt
            ? new Date(appliance.soldAt).toISOString()
            : undefined;

        // const checkSerialNo = await prisma.appliances.findUnique({
        //     where: {
        //         serialNo: appliance.serialNo,
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

        // if (appliance.predecessorId) {
        //     const checkPredecessor = await prisma.appliances.findUnique({
        //         where: {
        //             predecessorId: appliance.predecessorId,
        //         },
        //         select: {
        //             predecessorId: true,
        //         },
        //     });
        //     if (checkPredecessor)
        //         return NextResponse.json({
        //             message:
        //                 "Bu cihaz önceden başka bir cihazda eski cihaz olarak kullanılmıştır!",
        //             status: 400,
        //             ok: false,
        //         });
        // }

        const newAppliance = await prisma.appliances.create({
            data: appliance,
        });

        if (!newAppliance.id)
            return NextResponse.json({
                message: "Cihaz kaydedilemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "create",
                table: "appliances",
                user: newAppliance.createdBy,
                date: new Date().toISOString(),
                description: `Appliances created: ${newAppliance.id}`,
                data: JSON.stringify(newAppliance),
            },
        });

        return NextResponse.json({
            message: "Cihaz başarıyla kaydedildi!",
            status: 200,
            ok: true,
            data: newAppliance,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
