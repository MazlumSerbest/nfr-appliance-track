import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

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

        const setup = {
            status: "complete",
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            updatedBy: session?.user?.email || "",
        };

        const updatedSetup = await prisma.setups.update({
            where: {
                id: Number(params.id),
            },
            data: setup,
        });

        if (!updatedSetup.id)
            return NextResponse.json({
                message: "Kurulum güncellenemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "update",
                table: "setups",
                user: updatedSetup.updatedBy || "",
                date: new Date().toISOString(),
                description: `Setup completed: ${updatedSetup.id}`,
                data: JSON.stringify(updatedSetup),
            },
        });

        return NextResponse.json({
            message: "Kurulum tamamlandı olarak işaretlendi!",
            status: 200,
            ok: true,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
