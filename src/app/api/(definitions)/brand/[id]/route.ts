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

        const data = await prisma.brands.findUnique({
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

        const brand: Brand = await request.json();
        brand.updatedAt = new Date().toISOString();

        const updatedBrand = await prisma.brands.update({
            where: {
                id: Number(params.id),
            },
            data: brand,
        });

        if (!updatedBrand.id)
            return NextResponse.json({
                message: "Marka güncellenemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "update",
                table: "brands",
                user: updatedBrand.updatedBy || "",
                date: new Date().toISOString(),
                description: `Brand updated: ${updatedBrand.id}`,
                data: JSON.stringify(updatedBrand),
            },
        });

        return NextResponse.json({
            message: "Marka başarıyla güncellendi!",
            status: 200,
            ok: true,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
