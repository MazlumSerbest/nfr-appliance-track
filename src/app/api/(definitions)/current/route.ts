import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";
import { currentTypes } from "@/lib/constants";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (session) {
            const currentType: any =
                request.nextUrl.searchParams.get("currentType");

            const data = await prisma.currents.findMany({
                where: {
                    type: currentType,
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
            const current: Current = await request.json();
            const currType = current.type;

            const newDealer = await prisma.currents.create({
                data: current,
            });

            if (newDealer.id) {
                return NextResponse.json(
                    {
                        message: `${
                            currentTypes.find((e) => e.key == currType)?.name
                        } başarıyla kaydedildi!`,
                    },
                    { status: 200 },
                );
            } else {
                return NextResponse.json(
                    {
                        message: `${
                            currentTypes.find((e) => e.key == currType)?.name
                        } kaydedilemedi!`,
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
