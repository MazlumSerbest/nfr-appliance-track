import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function POST(
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

        const req = await request.json();

        const updatedLicense = await prisma.licenseMailHistory.create({
            data: {
                licenseId: Number(params.id),
                to: req.to || "",
                subject: req.subject || "",
                content: req.content || "",
                createdBy: session.user?.name || "",
            },
        });

        if (updatedLicense.id) {
            await prisma.logs.create({
                data: {
                    action: "licenseMailSended",
                    table: "licenses",
                    user: session.user?.email || "",
                    date: new Date().toISOString(),
                    description: `License mail sended: ${updatedLicense.id}`,
                    data: JSON.stringify(updatedLicense),
                },
            });

            return NextResponse.json({
                message: "Mail başarıyla gönderildi!",
                status: 200,
                ok: true,
            });
        } else {
            return NextResponse.json({
                message: "Mail gönderilemedi!",
                status: 400,
                ok: false,
            });
        }
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
