import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const data = await prisma.licenseTypes.findFirst({
            where: {
                id: Number(params.id),
            },
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const licenseType: LicenseType = await request.json();
        licenseType.updatedAt = new Date().toISOString();
        await prisma.licenseTypes.update({
            where: {
                id: Number(params.id),
            },
            data: licenseType,
        });

        return NextResponse.json(
            {
                message: "Lisans tipi başarıyla güncellendi!",
            },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const licenseType: LicenseType = await request.json();

        await prisma.licenseTypes.delete({
            where: {
                id: Number(params.id),
            },
        });

        return NextResponse.json(
            {
                message: "Lisans tipi silindi!",
            },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
