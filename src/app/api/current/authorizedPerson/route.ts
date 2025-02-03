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

        const authorizedPerson: Address = await request.json();

        const newAuthorizedPerson = await prisma.authorizedPersons.create({
            data: authorizedPerson,
        });

        if (!newAuthorizedPerson.id)
            return NextResponse.json({
                message: "Yetkili kaydedilemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "create",
                table: "authorizedPersons",
                user: newAuthorizedPerson.createdBy,
                date: new Date().toISOString(),
                description: `Authorized person created: ${newAuthorizedPerson.id}`,
                data: JSON.stringify(newAuthorizedPerson),
            },
        });

        return NextResponse.json({
            message: "Yetkili başarıyla kaydedildi!",
            status: 200,
            ok: true,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
