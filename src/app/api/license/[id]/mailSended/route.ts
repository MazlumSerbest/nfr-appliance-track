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

        const updatedLicense = await prisma.licenses.update({
            data: {
                mailSended: true,
            },
            where: {
                id: Number(params.id),
            },
        });

        if (updatedLicense.id) {
            await prisma.logs.create({
                data: {
                    action: "licenseMailSended",
                    table: "licenses",
                    user: updatedLicense.updatedBy || "",
                    date: new Date().toISOString(),
                    description: `License mail sended: ${updatedLicense.id}`,
                    data: JSON.stringify(updatedLicense),
                },
            });

            return NextResponse.json({
                message: "Lisans başarıyla güncellendi!",
                status: 200,
                ok: true,
            });
        } else {
            return NextResponse.json({
                message: "Lisans güncellenemedi!",
                status: 400,
                ok: false,
            });
        }
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
