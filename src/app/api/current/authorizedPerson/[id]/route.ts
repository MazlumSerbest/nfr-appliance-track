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

        const authorizedPerson: AuthorizedPerson = await request.json();
        authorizedPerson.updatedAt = new Date().toISOString();

        const updatedAuthorizedPerson = await prisma.authorizedPersons.update({
            where: {
                id: Number(params.id),
            },
            data: authorizedPerson,
        });

        if (!updatedAuthorizedPerson.id)
            return NextResponse.json({
                message: "Yetkili güncellenemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "update",
                table: "authorizedPersons",
                user: updatedAuthorizedPerson.updatedBy || "",
                date: new Date().toISOString(),
                description: `Authorized Person updated: ${updatedAuthorizedPerson.id}`,
                data: JSON.stringify(updatedAuthorizedPerson),
            },
        });

        return NextResponse.json({
            message: "Yetkili başarıyla güncellendi!",
            status: 200,
            ok: true,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
