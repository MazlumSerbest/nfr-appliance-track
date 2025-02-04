import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";
import bcrypt from "bcrypt";

export async function GET() {
    try {
        const session = await getServerSession();

        if (!session)
            return NextResponse.json({
                message: "Authorization Needed!",
                status: 401,
                ok: false,
            });

        const data = await prisma.users.findMany({
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

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session)
            return NextResponse.json({
                message: "Authorization Needed!",
                status: 401,
                ok: false,
            });

        const user = await request.json();

        const checkUsername = await prisma.users.findUnique({
            where: {
                username: user.username,
            },
            select: {
                username: true,
            },
        });

        if (checkUsername)
            return NextResponse.json({
                message: "Bu kullanıcı adı önceden kullanılmıştır!",
                status: 400,
                ok: false,
            });

        const checkEmail = await prisma.users.findUnique({
            where: {
                email: user.email,
            },
            select: {
                email: true,
            },
        });

        if (checkEmail)
            return NextResponse.json({
                message: "Bu e-posta önceden kullanılmıştır!",
                status: 400,
                ok: false,
            });

        const hashedPassword = await bcrypt.hash(user.password, 10);

        if (!hashedPassword)
            return NextResponse.json({
                message: "Şifre kaydedilirken bir hata oluştu!",
                status: 400,
                ok: false,
            });

        user.password = hashedPassword;

        const newUser = await prisma.users.create({
            data: user,
        });

        if (!newUser.id)
            return NextResponse.json({
                message: "Kullanıcı oluşturulamadı!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "create",
                table: "users",
                user: newUser.createdBy,
                date: new Date().toISOString(),
                description: `User created: ${newUser.id}`,
                data: JSON.stringify(newUser),
            },
        });

        return NextResponse.json({
            message: "Kullanıcı başarıyla oluşturuldu!",
            status: 200,
            ok: true,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
