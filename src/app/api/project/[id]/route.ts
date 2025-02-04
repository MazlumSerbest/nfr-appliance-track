import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function GET(
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

        const data = await prisma.projects.findUnique({
            include: {
                customer: {
                    select: {
                        name: true,
                    },
                },
            },
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

        const project: Project = await request.json();
        project.updatedAt = new Date().toISOString();
        project.date = new Date(project.date).toISOString();

        const updatedProject = await prisma.projects.update({
            where: {
                id: Number(params.id),
            },
            data: project,
        });

        if (!updatedProject.id)
            return NextResponse.json({
                message: "Proje güncellenemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "update",
                table: "projects",
                user: updatedProject.updatedBy || "",
                date: new Date().toISOString(),
                description: `Project updated: ${updatedProject.id}`,
                data: JSON.stringify(updatedProject),
            },
        });

        return NextResponse.json({
            message: "Proje başarıyla güncellendi!",
            status: 200,
            ok: true,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
