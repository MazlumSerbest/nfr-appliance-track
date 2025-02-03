import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session)
            return NextResponse.json({
                message: "Authorization Needed!",
                status: 401,
                ok: false,
            });

        const address: Address = await request.json();

        const newAddress = await prisma.addresses.create({
            data: address,
        });

        if (!newAddress.id)
            return NextResponse.json({
                message: "Adres kaydedilemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "create",
                table: "addresses",
                user: newAddress.createdBy,
                date: new Date().toISOString(),
                description: `Address created: ${newAddress.id}`,
                data: JSON.stringify(newAddress),
            },
        });

        return NextResponse.json({
            message: "Adres başarıyla kaydedildi!",
            status: 200,
            ok: true,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
