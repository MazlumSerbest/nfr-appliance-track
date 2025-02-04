import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";
import bcrypt from "bcrypt";

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string; reset: boolean } },
) {
    try {
        const session = await getServerSession();

        if (!session)
            return NextResponse.json({
                message: "Authorization Needed!",
                status: 401,
                ok: false,
            });

        const data: any = await request.json();
        const reset: boolean =
            request.nextUrl.searchParams.get("reset") === "true";

        const user = await prisma.users.findFirst({
            where: {
                id: Number(params.id),
            },
        });

        if (!user)
            return NextResponse.json({
                message: "Kullanıcı bulunamadı!",
                status: 404,
                ok: false,
            });

        if (reset) {
            const hashedNewPassword = await bcrypt.hash("123456", 10);

            const updatedUser = await prisma.users.update({
                where: {
                    id: Number(params.id),
                },
                data: {
                    password: hashedNewPassword,
                    updatedAt: new Date().toISOString(),
                    updatedBy: user?.username,
                },
            });

            if (hashedNewPassword == updatedUser.password) {
                return NextResponse.json({
                    message: "Şifre başarıyla sıfırlandı!",
                    status: 200,
                    ok: true,
                });
            } else {
                return NextResponse.json({
                    message: "Şifre sıfırlanamadı!",
                    status: 400,
                    ok: false,
                });
            }
        }

        const passwordsMatch = await bcrypt.compare(
            data.password,
            user.password,
        );

        if (!passwordsMatch)
            return NextResponse.json({
                message: "Mevcut şifrenizi yanlış girdiniz!",
                status: 400,
                ok: false,
            });

        const hashedNewPassword = await bcrypt.hash(data.newPassword, 10);

        const updateUser = await prisma.users.update({
            where: {
                id: Number(params.id),
            },
            data: {
                password: hashedNewPassword,
                updatedAt: new Date().toISOString(),
                updatedBy: user?.username,
            },
        });

        if (hashedNewPassword == updateUser.password) {
            return NextResponse.json({
                message: "Şifre başarıyla güncellendi!",
                status: 200,
                ok: true,
            });
        } else {
            return NextResponse.json({
                message: "Şifre güncellenemedi!",
                status: 400,
                ok: false,
            });
        }
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
