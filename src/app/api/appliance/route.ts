import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (session) {
            let productId = Number(
                request.nextUrl.searchParams.get("productId"),
            );

            const data = await prisma.vAppliances.findMany({
                where: {
                    deleted: false,
                    ...(productId ? { productId: productId } : {}),
                },
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
        return NextResponse.json({ message: error }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession();

        if (session) {
            const appliance: Appliance = await request.json();
            appliance.boughtAt = appliance.boughtAt
                ? new Date(appliance.boughtAt).toISOString()
                : undefined;
            appliance.soldAt = appliance.soldAt
                ? new Date(appliance.soldAt).toISOString()
                : undefined;

            const newAppliance = await prisma.appliances.create({
                data: appliance,
            });

            if (newAppliance.id) {
                return NextResponse.json(
                    {
                        message: "Cihaz başarıyla kaydedildi!",
                    },
                    { status: 200 },
                );
            } else {
                return NextResponse.json(
                    {
                        message: "Cihaz kaydedilemedi!",
                    },
                    { status: 400 },
                );
            }
        }

        return NextResponse.json({
            message: "Authorization Needed!",
            status: 401,
        });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
