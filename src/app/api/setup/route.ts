import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";
import { sendMail } from "@/lib/sendmail";

export async function GET() {
    try {
        const session = await getServerSession();

        if (!session)
            return NextResponse.json({
                message: "Authorization Needed!",
                status: 401,
                ok: false,
            });

        const data = await prisma.vSetups.findMany({
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

        const setup: Setup = await request.json();

        const newSetup = await prisma.setups.create({
            data: setup,
        });

        if (!newSetup.id)
            return NextResponse.json({
                message: "Kurulum kaydedilemedi!",
                status: 400,
                ok: false,
            });

        if (newSetup.userId) {
            const user = await prisma.users.findUnique({
                where: {
                    id: newSetup.userId,
                },
                select: {
                    email: true,
                },
            });

            if (user?.email) {
                const setupUrl = `${process.env.NEXTAUTH_URL}/dashboard/setups/${newSetup.id}`;
                await sendMail({
                    to: user.email,
                    subject: "Kurulum Bildirimi",
                    html: `
                        <p>Size yeni bir kurulum görevi atandı (#${newSetup.id}).</p>
                        <p>Detayları görüntülemek için aşağıdaki bağlantıya tıklayınız:</p>
                        <a href="${setupUrl}">${setupUrl}</a>
                    `,
                });
            }
        }

        await prisma.logs.create({
            data: {
                action: "create",
                table: "setups",
                user: newSetup.createdBy,
                date: new Date().toISOString(),
                description: `Setup created: ${newSetup.id}`,
                data: JSON.stringify(newSetup),
            },
        });

        return NextResponse.json({
            message: "Kurulum başarıyla kaydedildi!",
            status: 200,
            ok: true,
            id: newSetup.id,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
