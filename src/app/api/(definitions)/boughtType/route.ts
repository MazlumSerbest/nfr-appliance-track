import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (session) {
            const data = await prisma.boughtTypes.findMany({
                orderBy: [
                    {
                        createdAt: "asc",
                    },
                ],
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

export async function POST(request: Request) {
    try {
        const session = await getServerSession();

        if (session) {
            const boughtType: BoughtType = await request.json();

            const newBoughtType = await prisma.boughtTypes.create({
                data: boughtType,
            });

            if (newBoughtType.id) {
                await prisma.logs.create({
                    data: {
                        action: "create",
                        table: "boughtTypes",
                        user: newBoughtType.createdBy,
                        date: new Date().toISOString(),
                        description: `Bought type created: ${newBoughtType.id}`,
                        data: JSON.stringify(newBoughtType),
                    },
                });

                return NextResponse.json({
                    message: "Alım tipi başarıyla kaydedildi!",
                    status: 200,
                    ok: true,
                });
            } else {
                return NextResponse.json({
                    message: "Alım tipi kaydedilemedi!",
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
