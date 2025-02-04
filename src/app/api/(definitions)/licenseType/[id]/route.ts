import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function GET({ params }: { params: { id: string } }) {
    try {
        const session = await getServerSession();

        if (!session)
            return NextResponse.json({
                message: "Authorization Needed!",
                status: 401,
                ok: false,
            });
        const data = await prisma.licenseTypes.findUnique({
            where: {
                id: Number(params.id),
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

        const licenseType: any = await request.json();
        licenseType.updatedAt = new Date().toISOString();

        const updatedLicenseType = await prisma.licenseTypes.update({
            where: {
                id: Number(params.id),
            },
            data: licenseType,
        });

        if (!updatedLicenseType.id)
            return NextResponse.json({
                message: "Lisans tipi güncellenemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "update",
                table: "licenseTypes",
                user: updatedLicenseType.updatedBy || "",
                date: new Date().toISOString(),
                description: `License type updated: ${updatedLicenseType.id}`,
                data: JSON.stringify(updatedLicenseType),
            },
        });

        return NextResponse.json({
            message: "Lisans tipi başarıyla güncellendi!",
            status: 200,
            ok: true,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
