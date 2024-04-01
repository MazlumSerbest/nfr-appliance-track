import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function GET(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getServerSession();

        if (session) {
            const data = await prisma.projects.findUnique({
                include: {
                    customer: {
                        select: {
                            name: true,
                        }
                    }
                },
                where: {
                    id: Number(params.id),
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
            const project: Project = await request.json();
            project.updatedAt = new Date().toISOString();
            project.date = new Date(project.date).toISOString();

            const updatedProject = await prisma.projects.update({
                where: {
                    id: Number(params.id),
                },
                data: project,
            });

            if (updatedProject.id) {
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
            } else {
                return NextResponse.json({
                    message: "Proje güncellenemedi!",
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
