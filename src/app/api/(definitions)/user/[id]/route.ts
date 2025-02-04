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

        const user: User = await request.json();
        user.updatedAt = new Date().toISOString();

        const updatedUser = await prisma.users.update({
            where: {
                id: Number(params.id),
            },
            data: user,
        });

        if (!updatedUser.id)
            return NextResponse.json({
                message: "Kullanıcı güncellenemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "update",
                table: "users",
                user: updatedUser.updatedBy || "",
                date: new Date().toISOString(),
                description: `User updated: ${updatedUser.id}`,
                data: JSON.stringify(updatedUser),
            },
        });

        return NextResponse.json({
            message: "Kullanıcı başarıyla güncellendi!",
            status: 200,
            ok: true,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
