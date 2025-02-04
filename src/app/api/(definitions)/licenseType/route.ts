import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function GET() {
    try {
        const session = await getServerSession();

        if (!session)
            return NextResponse.json({
                message: "Authorization Needed!",
                status: 401,
                ok: false,
            });

        const data = await prisma.vLicenseTypes.findMany({
            orderBy: [
                {
                    createdAt: "asc",
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

        const licenseType: any = await request.json();

        const newLicenseType = await prisma.licenseTypes.create({
            data: licenseType,
        });

        if (!newLicenseType.id)
            return NextResponse.json({
                message: "Lisans tipi kaydedilemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "create",
                table: "licenseTypes",
                user: newLicenseType.createdBy,
                date: new Date().toISOString(),
                description: `License type created: ${newLicenseType.id}`,
                data: JSON.stringify(newLicenseType),
            },
        });

        return NextResponse.json({
            message: "Lisans tipi başarıyla kaydedildi!",
            status: 200,
            ok: true,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
