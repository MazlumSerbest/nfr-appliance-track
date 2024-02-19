import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function GET(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getServerSession();

        if (session) {
            const data = await prisma.boughtTypes.findUnique({
                where: {
                    id: Number(params.id),
                },
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

export async function PUT(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getServerSession();

        if (session) {
            const boughtType: BoughtType = await request.json();
            boughtType.updatedAt = new Date().toISOString();

            const updateBoughtType = await prisma.boughtTypes.update({
                where: {
                    id: Number(params.id),
                },
                data: boughtType,
            });

            if (updateBoughtType.id) {
                return NextResponse.json({
                    message: "Alım tipi başarıyla güncellendi!",
                    status: 200,
                    ok: true,
                });
            } else {
                return NextResponse.json({
                    message: "Alım tipi güncellenemedi!",
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
