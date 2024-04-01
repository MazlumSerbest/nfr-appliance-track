import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";
import { currentTypes } from "@/lib/constants";

export async function GET(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getServerSession();

        if (session) {
            const data = await prisma.currents.findUnique({
                where: {
                    id: Number(params.id),
                },
                include: {
                    authorizedPersons: true,
                    addresses: true,
                },
            });

            return NextResponse.json(data);
        }

        return NextResponse.json({
            message: "Authorization Needed!",
            status: 401,
            ok: false,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getServerSession();

        if (session) {
            const current: Current = await request.json();
            const currType = current.type;
            current.updatedAt = new Date().toISOString();

            const updatedCurrent = await prisma.currents.update({
                where: {
                    id: Number(params.id),
                },
                data: current,
            });

            if (updatedCurrent.id) {
                await prisma.logs.create({
                    data: {
                        action: "update",
                        table: "currents",
                        user: updatedCurrent.updatedBy || "",
                        date: new Date().toISOString(),
                        description: `Current updated: ${updatedCurrent.id}`,
                        data: JSON.stringify(updatedCurrent),
                    },
                });

                return NextResponse.json({
                    message: `${
                        currentTypes.find((e) => e.key == currType)?.name
                    } başarıyla güncellendi!`,
                    status: 200,
                    ok: true,
                });
            } else {
                return NextResponse.json({
                    message: `${
                        currentTypes.find((e) => e.key == currType)?.name
                    } güncellenemedi!`,
                    status: 400,
                    ok: false,
                });
            }
        }

        return NextResponse.json({
            message: "Authorization Needed!",
            status: 401,
            ok: false,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getServerSession();

        if (session) {
            const current: Current = await request.json();
            const currType = current.type;

            await prisma.currents.delete({
                where: {
                    id: Number(params.id),
                },
            });

            return NextResponse.json({
                message: `${
                    currentTypes.find((e) => e.key == currType)?.name
                } silindi!`,
                status: 200,
                ok: true,
            });
        }

        return NextResponse.json({
            message: "Authorization Needed!",
            status: 401,
            ok: false,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
