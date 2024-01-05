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
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500 });
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
                return NextResponse.json({
                    message: "Alım tipi başarıyla kaydedildi!",
                    status: 200,
                });
            } else {
                return NextResponse.json({
                    message: "Alım tipi kaydedilemedi!",
                    status: 400,
                });
            }
        }

        return NextResponse.json({
            message: "Authorization Needed!",
            status: 401,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500 });
    }
}
