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
            const data = await prisma.users.findUnique({
                where: {
                    email: params.id,
                },
                select: {
                    id: true,
                    username: true,
                    name: true,
                    email: true,
                    role: true,
                    active: true,
                    createdBy: true,
                    createdAt: true,
                    updatedBy: true,
                    updatedAt: true,
                },
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

export async function PUT(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getServerSession();

        if (session) {
            const user: User = await request.json();
            user.updatedAt = new Date().toISOString();

            await prisma.users.update({
                where: {
                    id: Number(params.id),
                },
                data: user,
            });

            return NextResponse.json({
                message: "Kullanıcı başarıyla güncellendi!",
                status: 200,
            });
        }

        return NextResponse.json({
            message: "Authorization Needed!",
            status: 401,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500 });
    }
}
