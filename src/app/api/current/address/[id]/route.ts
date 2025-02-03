import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function PUT(
    request: Request,
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

        const address: Address = await request.json();
        address.updatedAt = new Date().toISOString();

        const updatedAddress = await prisma.addresses.update({
            where: {
                id: Number(params.id),
            },
            data: address,
        });

        if (!updatedAddress.id)
            return NextResponse.json({
                message: "Adres güncellenemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "update",
                table: "addresses",
                user: updatedAddress.updatedBy || "",
                date: new Date().toISOString(),
                description: `Address updated: ${updatedAddress.id}`,
                data: JSON.stringify(updatedAddress),
            },
        });

        return NextResponse.json({
            message: "Adres başarıyla güncellendi!",
            status: 200,
            ok: true,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
